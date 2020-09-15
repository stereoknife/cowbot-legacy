import * as Sentry from '@sentry/node'

export const S = Sentry.Severity

Sentry.init()

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
