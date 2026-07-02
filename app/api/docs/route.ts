import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Kinetik Capital API",
    version: "1.0.0",
    description: "Loan Management Platform API",
    contact: {
      name: "Kinetik Capital",
      email: "info@kinetikcapital.com",
    },
  },
  servers: [
    {
      url: "https://kinetik-capital-loans.vercel.app",
      description: "Production Server",
    },
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Lead: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string" },
          mobile: { type: "string" },
          email: { type: "string" },
          loanType: { type: "string" },
          status: { type: "string", enum: ["New", "Contacted", "Processing", "Approved", "Rejected"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Partner: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string" },
          email: { type: "string" },
          mobile: { type: "string" },
          status: { type: "string", enum: ["Pending", "Approved", "Rejected"] },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/leads": {
      post: {
        summary: "Submit a new lead",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "mobile", "loanType"],
                properties: {
                  fullName: { type: "string" },
                  mobile: { type: "string" },
                  email: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  loanType: { type: "string" },
                  monthlyIncome: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Lead submitted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    lead: { $ref: "#/components/schemas/Lead" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/leads": {
      get: {
        summary: "Get all leads (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["all", "New", "Contacted", "Processing", "Approved", "Rejected"] },
            description: "Filter by status",
          },
        ],
        responses: {
          200: {
            description: "List of leads",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    leads: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Lead" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["password"],
                properties: {
                  email: { type: "string", format: "email" },
                  mobile: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        fullName: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/signup": {
      post: {
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "mobile", "password"],
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string", format: "email" },
                  mobile: { type: "string" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User created successfully",
          },
        },
      },
    },
    "/api/partners": {
      post: {
        summary: "Register as a partner",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "mobile", "city"],
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string" },
                  mobile: { type: "string" },
                  city: { type: "string" },
                  partnerType: { type: "string", enum: ["individual", "firm", "corporate"] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Partner registered successfully",
          },
        },
      },
    },
    "/api/admin/partners": {
      get: {
        summary: "Get all partners (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["all", "Pending", "Approved", "Rejected"] },
            description: "Filter by status",
          },
        ],
        responses: {
          200: {
            description: "List of partners",
          },
        },
      },
    },
    "/api/payment/create": {
      post: {
        summary: "Create Razorpay order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["leadId", "amount"],
                properties: {
                  leadId: { type: "string" },
                  amount: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order created",
          },
        },
      },
    },
    "/api/payment/verify": {
      post: {
        summary: "Verify Razorpay payment",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "paymentId", "signature", "leadId"],
                properties: {
                  orderId: { type: "string" },
                  paymentId: { type: "string" },
                  signature: { type: "string" },
                  leadId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Payment verified",
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec);
}