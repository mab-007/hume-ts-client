import { Hume } from "hume";

/**
 * fetches the weather at a given location in a specified temperature format
 * */ 
async function fetchWeather(location: string, format: string): Promise<string> {
  console.log(location);
  return `${37} in ${format}`;
}


async function webSearch(query: string) : Promise<any> {
  console.log(query);
  return "test";
}

/**
 * handles ToolCall messages received from the WebSocket connection
 * */ 
export async function handleToolCallMessage(
  toolCallMessage: Hume.empathicVoice.ToolCallMessage,
  socket: Hume.empathicVoice.chat.ChatSocket | null): Promise<void> {
  if (toolCallMessage.name === "get_current_weather") {
    try{
      // parse the parameters from the ToolCall message
      const args = JSON.parse(toolCallMessage.parameters) as {
        location: string;
        format: string;
      };

      // extract the individual arguments
      const { location, format } = args;

      // call weather fetching function with extracted arguments
      const weather = await fetchWeather(location, format);

      // send ToolResponse message to the WebSocket
      const toolResponseMessage = {
        type: "tool_response",
        toolCallId: toolCallMessage.toolCallId,
        content: weather,
      };

      socket?.sendToolResponseMessage(toolResponseMessage);
    } catch (error) {
      // send ToolError message to the WebSocket if there was an error fetching the weather
      const weatherToolErrorMessage = {
        type: "tool_error",
        toolCallId: toolCallMessage.toolCallId,
        error: "Weather tool error",
        content: "There was an error with the weather tool",
      };

      socket?.sendToolErrorMessage(weatherToolErrorMessage);
    }
  } 
  else if (toolCallMessage.name === 'web_search') {
    const args = JSON.parse(toolCallMessage.parameters) as {
      query: string;
    };

    const { query } = args;

    const webSearchResult = await webSearch(query);

    const toolResponseMessage = {
      type: "tool_response",
      toolCallId: toolCallMessage.toolCallId,
      content: webSearchResult,
    };

    socket?.sendToolResponseMessage(toolResponseMessage);
  }
  else {
    // send ToolError message to the WebSocket if the requested tool was not found
    const toolNotFoundErrorMessage = {
      type: "tool_error",
      toolCallId: toolCallMessage.toolCallId,
      error: "Tool not found",
      content: "The tool you requested was not found",
    };

    socket?.sendToolErrorMessage(toolNotFoundErrorMessage);
  }
}
