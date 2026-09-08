import path from "node:path";
import { describe, expect, it } from "vitest";
import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { CustomerClient } from "../src/customerClient.js";

describe("CustomerClient Pact", () => {
  it("gets the customer fields used by the TypeScript consumer", async () => {
    // These names become part of the generated Pact file name and must match
    // what the provider verifier expects: typescript-consumer-customer-provider.json.
    const provider = new PactV3({
      consumer: "typescript-consumer",
      provider: "customer-provider",
      // Pact JS writes the generated contract here after executeTest succeeds.
      // The provider repo checks out this consumer repo and reads this folder.
      dir: path.resolve(process.cwd(), "pacts")
    });

    // This defines the contract interaction against a temporary Pact mock provider.
    // The real customer-provider application is not running during this test.
    provider
      .uponReceiving("A request for customer 123")
      .withRequest({
        // This is the request the real CustomerClient must make to the mock provider.
        method: "GET",
        path: "/customers/123",
        headers: {
          Accept: "application/json"
        }
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: {
          // This consumer only depends on id and name. Do not add email or
          // phone here, otherwise the provider would be forced to keep them.
          id: MatchersV3.integer(123),
          name: MatchersV3.string("John")
        }
      });

    await provider.executeTest(async (mockServer) => {
      // mockServer.url is the temporary Pact mock provider URL. The real typed
      // client is pointed at it for this test only.
      const client = new CustomerClient(mockServer.url);
      const customer = await client.getCustomer(123);

      // These assertions prove the consumer code can read the fields it uses.
      // Pact separately records the request and response expectations as JSON.
      expect(customer.id).toBe(123);
      expect(customer.name).toBe("John");
    });
  });
});
