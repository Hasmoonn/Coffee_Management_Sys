import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiResponse } from '../utils/apiResponse'
import * as menuService from '../services/menu.service'
import { uploadToCloudinary } from '../utils/cloudinary'


export const getAllMenuItems = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await menuService.getAllMenuItems(req.query)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Menu items fetched'))
  }
)

export const getMenuByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params
    const result = await menuService.getMenuByCategory(slug)
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Category menu fetched'))
  }
)

export const getMenuItem = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const item = await menuService.getMenuItemById(id)
    return res
      .status(200)
      .json(new ApiResponse(200, item, 'Menu item fetched'))
  }
)

export const getFeaturedItems = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await menuService.getFeaturedItems()
    return res
      .status(200)
      .json(new ApiResponse(200, items, 'Featured items fetched'))
  }
)

export const createMenuItem = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      price,
      categoryId,
      calories,
      preparationTime,
      customizations,
    } = req.body
    let imageUrl = ''
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file)
    }


    const item = await menuService.createMenuItem({
      name,
      description,
      price: parseFloat(price),
      categoryId,
      imageUrl,
      calories: calories ? parseInt(calories) : undefined,
      preparationTime: preparationTime ? parseInt(preparationTime) : undefined,
      customizations: typeof customizations === 'string' ? JSON.parse(customizations) : customizations,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, item, 'Menu item created'))
  }
)

export const updateMenuItem = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData: any = { ...req.body }
    
    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(req.file)
    }


    // Parse numeric and boolean fields if they exist
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.calories) updateData.calories = parseInt(updateData.calories)
    if (updateData.preparationTime) updateData.preparationTime = parseInt(updateData.preparationTime)
    if (updateData.isAvailable !== undefined) updateData.isAvailable = updateData.isAvailable === 'true'
    if (updateData.isFeatured !== undefined) updateData.isFeatured = updateData.isFeatured === 'true'
    if (typeof updateData.customizations === 'string') {
      try {
        updateData.customizations = JSON.parse(updateData.customizations)
      } catch (e) {
        // keep as is
      }
    }

    const item = await menuService.updateMenuItem(id, updateData)
    return res
      .status(200)
      .json(new ApiResponse(200, item, 'Menu item updated'))
  }
)

export const deleteMenuItem = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    await menuService.deleteMenuItem(id)
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Menu item deleted'))
  }
)

export const toggleAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const item = await menuService.toggleAvailability(id)
    return res
      .status(200)
      .json(new ApiResponse(200, item, 'Availability toggled'))
  }
)