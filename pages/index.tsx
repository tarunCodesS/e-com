import Layout from "../layouts/Main";
// import PageIntro from "../components/page-intro";
// import ProductsFeatured from "../components/products-featured";
// import { CURRENCY_SYMBOLE } from 'config';

// import ProductsFeatured from "../components/products-featured`;
import Footer from "../components/footer";
// import Subscribe from "../components/subscribe";
import { API_URL } from "../config";
import { useEffect, useState } from "react";
// import Link from "next/link";
import RenderPageSection from "../cms/renderPageSections"
// import { forEach } from "lodash";
const IndexPage = () => {
  const [cmsData, setCmsData] = useState();
  const [authToken, setAuthToken] = useState<any>("");
  const [product, setProduct] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [ricohCms, setRicohCms] = useState<any[]>([])
  const [imageData, setImageData] = useState<any[]>([])
  console.log("productData",productData)
  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
  }, []);

  // const getCmsData = async () => {
  //   const resp = await fetch(
  //     `https://api.contentful.com/spaces/b7hw33ucy3y5/environments/master/entries`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         "Authorization": "Bearer CFPAT-KzYKhO_GOkax642G9p4aKHTTmVCVrqwZg597yLpvXhE",
  //       },
  //     },
  //   );
  //   const result = await resp.json();
  //   result.items.forEach((element: any) => {
  //     if (element.sys.contentType.sys.id === "nextTest") {
  //       setCmsData(element.fields)
  //     }
  //   });
  // }

  const fetchData = async () => {
    const url =
      "https://graphql.contentful.com/content/v1/spaces/b7hw33ucy3y5/environments/master";
    const query = `{
      nextContentfulHeaderImageCollection {
        items {
          description
          heroBanner {
            url
          }
        }
      }
      nextContentfulMidSectionCollection {
        items {
          midSectionImageCollection {
            items {
              url
            }
          }
          midSectionDescription
          midSectionButtonTitle
        }
      }
      nextContentfulBottomCollection {
        items {
          iconClass
          iconTitle
          iconDescription
        }
      }
    }`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 1bKW_Ovigequ04fW779NKR1inURdE7FPGRKhIFRMyuM",
      },
      body: JSON.stringify({ query }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setCmsData(data.data);
      // Process the response data as per your requirements
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  const getRelatedProduct = async () => {
    try {
      const resp = await fetch(
        `${API_URL}/abstract-products/408244/related-products`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!resp.ok) {
        // Handle non-2xx status codes (e.g., 4xx, 5xx)
        throw new Error(
          `Failed to fetch related products: ${resp.status} ${resp.statusText}`
        );
      }
      const result = await resp.json();
      setProduct(result?.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const getProductDetails = async (id: any) => {
    const resp = await fetch(
      `${API_URL}/concrete-products/${id}?include=concrete-product-availabilities%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }
    );
    const result = await resp.json();
    setProductData((productData) => [
      ...productData,
      {
        name: result.data.attributes.name,
        id: result.data.id,
        image:
          result.included[0]?.attributes?.imageSets[0]?.images[0]
            ?.externalUrlLarge,
        price: result.included[2]?.attributes?.price,
      },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getRelatedProduct();
  }, [authToken]);

  useEffect(() => {
    setProductData([]);
    if (product?.length > 0) {
      product.forEach((element: any) => {
        getProductDetails(
          element.attributes.attributeMap.product_concrete_ids[0]
        );
      });
    }
  }, [product]);

  const getCmsData = async () => {
    try{
    const resp = await fetch(
      "https://cdn.contentful.com/spaces/cp3b8ygfr8vj/environments/master/entries",
      {
        method: "GET",
        headers: {
          authorization: `Bearer han2JFRAHW29fPTXp-2tIonLLKQicrfxfH6rFW-f9oY`,
        },
      }
    );
    const result = await resp.json();
    console.log("result-ricoh-cms---", result);
    setImageData(result.includes.Asset);
    const arr: any = [];
    result.items.forEach((element: any) => {
      arr.push({
        id: element.sys.contentType.sys.id,
        data: element.fields,
      });
    });
    const modifiedData = arr.reduce((acc: any, item: any) => {
      const { id, data } = item;
      const existingObj = acc.find((obj: any) => obj.id === id);
      if (existingObj) {
        existingObj.data.push(data);
      } else {
        acc.push({
          id,
          data: [data],
        });
      }
      return acc;
    }, []);

    setRicohCms(modifiedData);
    console.log("modifiedData", modifiedData);
  }
  catch(error){
    console.log(error);
  }
  };
  useEffect(() => {
    getCmsData();
  }, []);

  return (
    <Layout>
      {cmsData ? (
        <>
          {/* <PageIntro cmsData={cmsData} /> */}
          <RenderPageSection sections={ricohCms} imageData={imageData} />
          {/* <section className="featured">
            <div className="container">
              <article
                style={{
                  backgroundImage: `url(${cmsData.nextContentfulMidSectionCollection.items[0].midSectionImageCollection.items[0].url})`,
                }}
                className="featured-item featured-item-large"
              >
                <div className="featured-item__content">
                  <h3>
                    {
                      cmsData.nextContentfulMidSectionCollection.items[0]
                        .midSectionDescription
                    }
                  </h3>
                  <a href="#" className="btn btn--rounded">
                    {
                      cmsData.nextContentfulMidSectionCollection.items[0]
                        .midSectionButtonTitle
                    }
                  </a>
                </div>
              </article>
              <article
                style={{
                  backgroundImage: `url(${cmsData.nextContentfulMidSectionCollection.items[1].midSectionImageCollection.items[0].url})`,
                }}
                className="featured-item featured-item-small-first"
              >
                <div className="featured-item__content">
                  <h3>
                    {
                      cmsData.nextContentfulMidSectionCollection.items[1]
                        .midSectionDescription
                    }
                  </h3>
                  <a href="#" className="btn btn--rounded">
                    {
                      cmsData.nextContentfulMidSectionCollection.items[1]
                        .midSectionButtonTitle
                    }
                  </a>
                </div>
              </article>

              <article
                style={{
                  backgroundImage: `url(${cmsData.nextContentfulMidSectionCollection.items[2].midSectionImageCollection.items[0].url})`,
                }}
                className="featured-item featured-item-small"
              >
                <div className="featured-item__content">
                  <h3>
                    {
                      cmsData.nextContentfulMidSectionCollection.items[2]
                        .midSectionDescription
                    }
                  </h3>
                  <a href="#" className="btn btn--rounded">
                    {
                      cmsData.nextContentfulMidSectionCollection.items[2]
                        .midSectionButtonTitle
                    }
                  </a>
                </div>
              </article>
            </div>
          </section>
          <section className="section">
            <div className="container">
              <header className="section__intro">
                <h4>Why should you choose us?</h4>
              </header>

              <ul className="shop-data-items">
                {cmsData.nextContentfulBottomCollection.items.length > 0
                  ? cmsData.nextContentfulBottomCollection.items.map(
                    (item: any) => {
                      return (
                        <li>
                          <i className={item.iconClass}></i>
                          <div className="data-item__content">
                            <h4>{item.iconTitle}</h4>
                            <p>{item.iconDescription}</p>
                          </div>
                        </li>
                      );
                    }
                  )
                  : null}
              </ul>
            </div>
          </section> */}
        </>
      ) : null}
      {/* <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          paddingInline: "100px",
          color: "#7f7f7f",
        }}
      >
        Recommended Products
      </h1>
      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          marginInline: "100px",
          marginBottom: "20px",
        }}
      >
        {productData.map((item: any) => {
          return (
            <div style={{ padding: "5px" }}>
              <Link
                href={`/product/${item.name}?skuId=${item.id.split("_")[0]}`}
              >
                <div style={{ padding: "5px" }}>
                  <img
                    src={item.image}
                    style={{
                      width: "220px",
                      height: "250px",
                      objectFit: "contain",
                    }}
                  />
                  <p style={{ paddingLeft: "10px" }}>{item.name}</p>
                  <p
                    style={{
                      fontWeight: "bold",
                      paddingTop: "5px",
                      paddingLeft: "10px",
                    }}
                  >
                    {CURRENCY_SYMBOLE} {item.price}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div> */}

      {/* <ProductsFeatured /> */}
      {/* <Subscribe /> */}
      <Footer />
    </Layout>
  );
};

export default IndexPage;
