import { NextResponse } from 'next/server'

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  )
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: string
) {
  return NextResponse.json(
    { success: false, error, ...(details && { details }) },
    { status }
  )
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  items: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  status: number = 200
) {
  return NextResponse.json(
    {
      items,
      pagination: {
        ...pagination,
        hasMore: (pagination.page - 1) * pagination.limit + items.length < pagination.total,
      },
    },
    { status }
  )
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Handle errors and return appropriate response
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof Error) {
    // Check for Prisma errors
    if (error.message.includes('Record to delete does not exist') ||
        error.message.includes('Record to update not found')) {
      return errorResponse('Record not found', 404)
    }
    return errorResponse(error.message, 500)
  }

  return errorResponse('Internal server error', 500)
}


