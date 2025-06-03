import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";



const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"], // Track requests by IP
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "POSTMAN",
                "CURL"
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});

const arcjectMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 5 });
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "No bots allowed" });
            } else {
                return res.status(403).json({ message: "Forbidden" });
            }
        } else if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ message: "Forbidden" });
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        next(err);
    };
}
export default arcjectMiddleware;