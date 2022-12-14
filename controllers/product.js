

import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Auth from './auth.js';

import Brand from '../models/brand.js';
import Category from '../models/category.js';
import Product from '../models/product.js';
import Company from '../models/company.js';
import { getCompaniesWithLocation } from './company.js'


//GET BRAND SWAGGER
/**
 * @swagger
 * /api/product/get_all_brands:
 *  get:
 *      summary: Return a list of all brands
 *      tags: [Products]
 *      responses: 
 *          200:
 *              description: This is the list of all brands
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */

router.get('/get_all_brands', async (req, res) => {
    Brand.find()
        .then(brands => {
            if (brands.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: brands
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No brands exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});
//GET BRAND SWAGGER
/**
 * @swagger
 * /api/product/get_brand_by_id/{id}:
 *  get:
 *      summary: Get brand name by id
 *      tags: [Products]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Brand Returned
 *          500:
 *              description: Error occured
 */

router.get('/get_brand_by_id/:id', async (req, res) => {
    Brand.findById(req.params.id)
        .then(brand => {
            if (brand) {
                return res.status(200).json({
                    status: true,
                    message: brand
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No brands exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});
//GET BRAND SWAGGER
/**
 * @swagger
 * definitions:
 *  Brand:
 *      type: object
 *      properties:
 *          brandName: 
 *              type: string
 *              description: The name of the brand
 *              example: Nike
 *          brandLogo: 
 *              type: string
 *              description: The url of the brand's image
 *              example: nike_logo.png
 */

/**
 * @swagger
 * /api/product/create_new_brand:
 *  post:
 *      summary: Create new brand
 *      description: Use this Endpoint to create new brand
 *      tags: [Products]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Brand'
 *      responses:
 *          200:
 *              decription: Brand Created
 *          500:
 *              description: Error in create
 */

router.post('/create_new_brand', Auth, async (req, res) => {
    const id = mongoose.Types.ObjectId();

    const { brandName, brandLogo } = req.body;

    if (brandName === '' || brandLogo === '') {
        return res.status(200).json({
            status: false,
            message: 'One or more fields are missing'
        });
    }

    Brand.findOne({ brandName: brandName })
        .then(brand => {
            if (brand) {
                return res.status(200).json({
                    status: false,
                    message: `${brand.brandName} is already taken`
                });
            }

            const _brand = new Brand({
                _id: id,
                brandName: brandName,
                brandLogo: brandLogo
            })
            _brand.save()
                .then(brand_created => {
                    return res.status(200).json({
                        status: true,
                        message: brand_created
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: false,
                        message: err.message
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            });
        });

});

//GET ALL CATEGORIES
/**
 * @swagger
 * /api/product/get_all_categories:
 *  get:
 *      summary: Return a list of all categories
 *      tags: [Products]
 *      responses: 
 *          200:
 *              description: This is the list of all categories
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */

router.get('/get_all_categories', async (req, res) => {
    Category.find()
        .then(category_exists => {
            if (category_exists.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: category_exists
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No Categories exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});

router.post('/create_new_category', Auth, async (req, res) => {
    const id = mongoose.Types.ObjectId();

    const categoryName = req.body.categoryName;
    if (categoryName === '') {
        return res.status(200).json({
            status: false,
            message: 'One or more fields are missing'
        });
    }
    Category.findOne({ categoryName: categoryName })
        .then(category_found => {
            if (category_found) {
                return res.status(200).json({
                    status: false,
                    message: `${categoryName} is already taken`
                })
            } else {

                const _category = new Category({
                    _id: id,
                    categoryName: categoryName
                })
                _category.save()
                    .then(category_created => {
                        return res.status(200).json({
                            status: true,
                            message: category_created
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        });
                    });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            });
        });
});

/**
 * @swagger
 * /api/product/get_all_products:
 *  get:
 *      summary: Return a list of all products
 *      tags: [Products]
 *      responses: 
 *          200:
 *              description: OK successfull
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *          500:
 *              description: Error was found
 */

router.get('/get_all_products', async (req, res) => {
    console.log(req.body)
    Product.find()
        .then(products_exist => {
            if (products_exist.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: products_exist
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'No Products exist'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
});

router.post('/create_new_product', Auth, async (req, res) => {
    const id = mongoose.Types.ObjectId();

    const { companyId, categoryId, brandId, productName,
        productImage, productPrice, productDescription, unitInStock, tags, targetAge } = req.body;

    const _product = new Product({
        _id: id,
        companyId: companyId,
        categoryId: categoryId,
        brandId: brandId,
        productName: productName,
        productImage: [
            {
                imageSource: productImage
            }],
        productPrice: productPrice,
        productDescription: productDescription,
        unitInStock: unitInStock,
        reviews: [],
        tags: tags,
        targetAge: targetAge
    })
    _product.save()
        .then(product_created => {
            return res.status(200).json({
                status: true,
                message: product_created
            })
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });
})


router.get('/get_most_related_products', Auth, async (req, res) => {

    const { locationRadius, latitude, longitude, budget, relation, interest, event, gender, age } = req.body;

    let productsByCompanies = [];

    let companiesId = [];
    //COMPANY -- CHECKED
    Company.find()
        .then(companies => {
            if (companies.length > 0) {
                let companiesWithLoc = getCompaniesWithLocation(companies, latitude, longitude);

                companiesWithLoc.forEach((company) => {
                    if (company.distance <= locationRadius || company.company_info.type === "online") {
                        companiesId.push(company.company_info._id);
                    }
                })
                //sorting by location and relation
                if (relation <= 3)
                    companiesWithLoc.sort((a, b) => b.distance - a.distance);
                else
                    companiesWithLoc.sort((a, b) => a.distance - b.distance);


                //PRODUCT -- CHECKED BUT NEED TO ADD MORE OF THE SORTING FIELDS
                Product.find({
                    //by distance - company
                    companyId: { $in: companiesId },
                    //by budget
                    productPrice: { $lte: budget },
                    $or: [{ targetAge: { $lte: age } }, { targetAge: age + 5 }],
                    $or: [{ tags: { $in: interest.map((i) => new RegExp(i, 'i')) } },
                    { tags: { $in: event.map((i) => new RegExp(i, 'i')) } },
                    { tags: new RegExp(gender, 'i') },
                    ],
                    $or: [{ productDescription: { $in: interest.map((i) => new RegExp(i, 'i')) } },
                    { productDescription: { $in: event.map((i) => new RegExp(i, 'i')) } },
                    { productDescription: new RegExp(gender, 'i') },]
                })
                    .then(products => {

                        if (products.length > 0) {

                            //sort by budget and relation
                            if (relation <= 3)
                                productsByCompanies.push(...products.sort((c1, c2) => c2.productPrice - c1.productPrice));
                            else
                                productsByCompanies.push(...products.sort((c1, c2) => c1.productPrice - c2.productPrice));

                            return res.status(200).json({
                                status: true,
                                productsFound: productsByCompanies.length,
                                message: productsByCompanies
                            })
                        } else {
                            return res.status(200).json({
                                status: false,
                                message: "No products were found please change your filters"
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            status: false,
                            message: err.message
                        })
                    });

            } else {
                return res.status(200).json({
                    status: false,
                    message: "No Companies were found"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        });




})


router.delete('/delete_brand', Auth, async (req, res) => {

});
router.delete('/delete_category', Auth, async (req, res) => {

});
router.delete('/delete_product', Auth, async (req, res) => {

});


export default router;