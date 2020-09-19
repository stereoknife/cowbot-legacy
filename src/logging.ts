import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing';

export const S = Sentry.Severity

Sentry.init({
  dsn: "https://a8268f75e05a4b74b903ef2bdbaee7da@o449034.ingest.sentry.io/5431330",
  tracesSampleRate: 1.0,
})

export default function message (severity: Sentry.Severity, message: any) {
  Sentry.withScope((scope) => {
    scope.setLevel(severity)
    if (severity === S.Info || severity === S.Debug || severity === S.Log) {
      Sentry.captureMessage(message)
    } else {
      Sentry.captureException(message)
    }
  })
}
