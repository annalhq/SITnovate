import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";

export const runtime = "edge";

export async function POST(req: Request) {
     const { messages }: { messages: Message[] } = await req.json();

     const textStream = await streamText({
          model: ollama.ChatTextGenerator({ model: "llama3.2" }).withChatPrompt(),
          prompt: {
               system:
                    "You are an email spam classifier checker" +
                    "Output the class of the email as spam or not spam",

               messages: asChatMessages(messages),
          },
     });

     return new StreamingTextResponse(
          ModelFusionTextStream(textStream, {
               onStart() {
                    console.log("onStart");
               },
               onToken(token) {
                    console.log("onToken", token);
               },
               onCompletion: () => {
                    console.log("onCompletion");
               },
               onFinal(completion) {
                    console.log("onFinal", completion);
               },
          })
     );
}