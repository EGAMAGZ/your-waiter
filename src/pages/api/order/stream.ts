import NotificationOrderController from "@/controllers/notification-orders";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    const body = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const sendEvent = (data: any) => {
                try {
                    const message = `data: ${JSON.stringify(data)}\n\n`;
                    controller.enqueue(encoder.encode(message));
                    console.log("SENT");
                } catch (error) {
                    NotificationOrderController.getInstance().unsubscribe(sendEvent);
                }
            };

            NotificationOrderController.getInstance().subscribe(sendEvent);

            request.signal.addEventListener("abort", () => {
                console.log("ABORT");
                NotificationOrderController.getInstance().unsubscribe(sendEvent);
                controller.close();
            });
        }
    });

    return new Response(body, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    });
}