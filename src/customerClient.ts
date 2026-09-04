export interface CustomerSummary {
  id: number;
  name: string;
}

export class CustomerClient {
  constructor(private readonly baseUrl: string) {}

  async getCustomer(id: number): Promise<CustomerSummary> {
    const response = await fetch(`${this.baseUrl}/customers/${id}`, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customer ${id}: HTTP ${response.status}`);
    }

    return await response.json() as CustomerSummary;
  }
}
