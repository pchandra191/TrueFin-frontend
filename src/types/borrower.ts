export interface Installment {
  month: string;
  amount: number;
  status: string;
}

export interface Borrower {
  _id: string;
  uniqueId: string;
  cityId: number;
  borrowerId: number;
  name: string;
  phoneNumber?: string;
  connectorName: string;
  IPM: number[];
  lastLeft: string;
  installmentCondition: string;
  installmentStartMonth: string;
  installments: Installment[];
  createdAt: string;
  updatedAt: string;
}

export interface BorrowersResponse {
  borrowers: Borrower[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
