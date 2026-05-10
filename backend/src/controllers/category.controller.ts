import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as categoryService from '../services/category.service'

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories()
    return res
      .status(200)
      .json(new ApiResponse(200, categories, 'Categories fetched'))
  }
)

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body)
    return res
      .status(201)
      .json(new ApiResponse(201, category, 'Category created'))
  }
)

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await categoryService.updateCategory(id, req.body)
    return res
      .status(200)
      .json(new ApiResponse(200, category, 'Category updated'))
  }
)

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    await categoryService.deleteCategory(id)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Category deleted'))
  }
)
