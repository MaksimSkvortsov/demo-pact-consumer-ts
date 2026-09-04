import path from "node:path";
import { describe, expect, it } from "vitest";
import { MatchersV3, PactV3 } from "@pact-foundation/pact";
import { CustomerClient } from "../src/customerClient.js";

describe("CustomerClient Pact", () => {
  it("gets the customer fields used by the TypeScript consumer", async () => {
    const provider = new PactV3({
      consumer: "typescript-consumer",
      provider: "customer-provider",
      dir: path.resolve(process.cwd(), "pacts")
    });

    provider
      .uponReceiving("A request for customer 123")
      .withRequest({
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
          id: MatchersV3.integer(123),
          name: MatchersV3.string("John")
        }
      });

    await provider.executeTest(async (mockServer) => {
      const client = new CustomerClient(mockServer.url);
      const customer = await client.getCustomer(123);

      expect(customer.id).toBe(123);
      expect(customer.name).toBe("John");
    });
  });
});
