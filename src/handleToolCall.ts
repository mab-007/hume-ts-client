import { Hume } from "hume";

/**
 * fetches the weather at a given location in a specified temperature format
 * */ 
// async function fetchWeather(location: string, format: string): Promise<string> {
//   console.log(location);
//   return `${37} in ${format}`;
// }


// async function webSearch(query: string) : Promise<any> {
//   console.log(query);
//   return "test";
// }

/**
 * handles ToolCall messages received from the WebSocket connection
 * */ 
export async function handleToolCallMessage(
  toolCallMessage: Hume.empathicVoice.ToolCallMessage,
  socket: Hume.empathicVoice.chat.ChatSocket | null): Promise<void> {


  if (toolCallMessage.name) {
    try{
      console.log("toolCallMessage.name callinggggg ,............");
      console.log(toolCallMessage.name);

       // integrate api call for http://localhost:5000/api/tool/:toolName and in body the arguments
      const result : Response = await fetch(`http://localhost:8080/api/tool/${toolCallMessage.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ parameters: toolCallMessage.parameters }),
      });
      console.log("result in tool call", result);

      if(result.status !== 200) {
        const toolNotFoundErrorMessage = {
          type: "tool_error",
          toolCallId: toolCallMessage.toolCallId,
          error: "Tool not found",
          content: "The tool you requested was not found",
        };

        socket?.sendToolErrorMessage(toolNotFoundErrorMessage);
      }

      const data = await result.text(); // Convert Response to string
      console.log("data in tool call", data);
      // send ToolResponse message to the WebSocket
      const toolResponseMessage = {
        type: "tool_response",
        toolCallId: toolCallMessage.toolCallId,
        content: data,
      };

      socket?.sendToolResponseMessage(toolResponseMessage);
    } catch (error) {
      console.log("error in tool call", error);
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
