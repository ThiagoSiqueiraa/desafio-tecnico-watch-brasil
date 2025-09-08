// src/tracing.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";

const exporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    "http://localhost:4318/v1/traces",
});

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME || "api-backend",
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations({}), new HttpInstrumentation(), new PgInstrumentation()],
});


sdk.start()

process.on("SIGINT", () => sdk.shutdown());
process.on("SIGTERM", () => sdk.shutdown());