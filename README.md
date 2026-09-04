# Demo Pact TypeScript Consumer

This repository owns the `typescript-consumer` expectations for the `customer-provider` API.

The consumer calls:

```http
GET /customers/{id}
```

The typed client is `CustomerClient`, and its response type is `CustomerSummary`. This consumer only depends on:

```json
{
  "id": 123,
  "name": "John"
}
```

It does not depend on `email` or `phone`. Removing `phone` from the provider is safe for this consumer. Removing `name` should cause provider verification to fail for this consumer only.

## Pact Contract

The Pact JSON file is generated from the consumer test. It is an artifact of the test, not a manually authored file.

Run:

```powershell
npm install
npm run build
npm test
```

On Windows ARM64, Pact JS `17.1.3` reports `win32-arm64` as unsupported. This repo was locally verified with a portable Windows x64 Node `v22.11.0` runtime. Linux GitHub Actions uses a supported `linux-x64` runtime and does not need that workaround.

The generated Pact is written to:

```text
pacts/typescript-consumer-customer-provider.json
```

The contract test uses Pact matchers for response field types, so the provider must return a numeric `id` and string `name`, but the contract does not constrain `email` or `phone`.

## GitHub Actions

The workflow in `.github/workflows/generate-pact.yml` installs dependencies, runs the consumer test, confirms that `pacts/typescript-consumer-customer-provider.json` exists, and commits generated Pact changes back to this repository.

Required workflow permissions:

```yaml
permissions:
  contents: write
```

This permission is already configured in the workflow. In the repository settings, ensure GitHub Actions is allowed to read and write repository contents.

The commit step is skipped when the current commit message starts with `chore: update generated Pact files` to avoid an infinite workflow loop.
