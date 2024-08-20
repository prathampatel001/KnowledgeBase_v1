
import { Request, Response, NextFunction } from 'express';
import {  Page, PageInterface } from './pageModel';

//Create new Page
export const addPage = async (req:Request,res:Response,next:NextFunction)  => {

  try {
    const newCollection: PageInterface = req.body;
    const page = new Page(newCollection);
    const savedPage = await page.save();

    //Delete the cached Pages
    // await redisClient?.del("allPages");

    res.status(201).json(savedPage);
  } catch (error) {
    next(error);
  }
}


//Delete Page
export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedPage = await Page.findByIdAndDelete(id);
    if (!deletedPage) {
      return res.status(404).send('Page not found');
    }

    /* redis
    // redisClient?.del("allPages")
    // const pageKey = `singlePage:${id}`;
    // await redisClient?.del(pageKey)
    */

    res.status(200).send('Page deleted successfully');
  } catch (error) {
    next(error);
  }
};

//Update Page
export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  // const updateData: Partial<CategoryInterface> = req.body;
  try {
    const updatedPage = await Page.findByIdAndUpdate(id, req.body);
    if (!updatedPage) {
      return res.status(404).send('Collection not found');
    }

    /* Redis
    redisClient?.del("allPages")
    const pageKey = `singlePage:${id}`;
    await redisClient?.del(pageKey)
    */

    res.status(200).json(updatedPage);
  } catch (error) {
    next(error);
  }
};


//Get Single Page
export const getPageById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    /* Redis
    // const cacheKey = `singlePage:${id}`;

    //   //Check if the Page is cached
    //   const cachedPages = await redisClient?.get(cacheKey);
    //   if (cachedPages) {
    //     console.log('Returning cached Pages');
    //     return res.status(200).json(JSON.parse(cachedPages));
    //   }
    */

    const page = await Page.findById(id)
      .populate({
        path: 'pageNestedUnder',
        populate: {
          path: 'pageNestedUnder',
          populate: {
            path: 'pageNestedUnder',
            populate: {
              path: 'pageNestedUnder',
              
        
            }
            
      
          }
        }
      })
      .populate('collectionId');

    if (!page) {
      return res.status(404).send('Page not found');
    }

    /* Redis
    //  // Cache the pages
    //  await redisClient?.set(cacheKey, JSON.stringify(page), {
    //   EX: 1800, // Cache expires in 30 minutes
    // });
    */


    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

//Get all Pages
export const getAllPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* Redis
    //   //Check if the Page is cached
    // const cachedPages = await redisClient?.get('allPages');
    // if (cachedPages) {
    //   console.log('Returning cached Pages');
    //   return res.status(200).json(JSON.parse(cachedPages));
    // }
    */


    //if not cached,fetch from Data
    const pages = await Page.find({})
      .populate({
        path: 'pageNestedUnder',
        populate: {
          path: 'pageNestedUnder',
          populate: {
            path: 'pageNestedUnder',
          
          }
        }
      })
      .populate('collectionId')
      .sort({ createdAt: -1 })
      .lean();

    if (pages.length === 0) {
      return res.status(404).json({ message: 'No Page found' });
    }

/* Redis
//     //Cache the Page
//   await redisClient?.set('allPages', JSON.stringify(pages), {
//     EX: 1800, // Cache expires in 30 minutes
//   });
*/

    res.status(200).json(pages);
  } catch (error) {
    next(error);
  }
};

