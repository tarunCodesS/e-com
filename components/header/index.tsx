import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useOnClickOutside from "use-onclickoutside";
import Link from "next/link";
import { useRouter } from "next/router";
import { RootState } from "store";
import { API_URL } from "config";

type HeaderType = {
  isErrorPage?: Boolean;
};

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const arrayPaths = ["/"];

  const [onTop, setOnTop] = useState(
    !arrayPaths.includes(router.pathname) || isErrorPage ? false : true
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchText, setSearchText] = useState();
  const [category, setCategory] = useState([]);
  const [authStatus, setAuthStatus] = useState<any>("false");
  const [authToken, setAuthToken] = useState<any>("");
  const [customerGroup, setCustomerGroup] = useState<any>();
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);

  useEffect(() => {
    setAuthStatus(localStorage.getItem("status"));
    setAuthToken(localStorage.getItem("token"));
    setCustomerGroup(localStorage.getItem("userId"));
  }, []);
  useEffect(() => {
    if (authToken) {
      setAuthStatus("true");
    } else {
      setAuthStatus("false");
    }
  }, [authToken]);

  const navRef = useRef(null);
  const searchRef = useRef(null);

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  };

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(true);
  };

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  useOnClickOutside(searchRef, closeSearch);

  // const getCategory = async () => {
  //   const resp = await fetch(`${API_URL}/category-trees`, {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //   });
  //   const result = await resp.json();
  //   setCategory(result?.data[0]?.attributes?.categoryNodesStorage);
  // };

  const getCategory = async () => {
    try {
      const resp = await fetch(`${API_URL}/category-trees`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await resp.json();
      setCategory(result?.data[0]?.attributes?.categoryNodesStorage);
    } catch (error) {
      console.error("Error while fetching category:", error);
    }}

  useEffect(() => {
    getCategory();
  }, []);

  // const checkTokenExpiry = async () => {
  //   if (authToken) {
  //     const data =
  //     {
  //       "data": {
  //         "type": "access-tokens",
  //         "attributes": {
  //           "username": "sonia@spryker.com",
  //           "password": "change123"
  //         }
  //       }
  //     }
  //     try {
  //       const resp = await fetch(
  //         `${API_URL}/access-tokens`,
  //         {
  //           method: 'POST',
  //           headers: {
  //             "Authorization": `Bearer ${authToken}`
  //           },
  //           body: JSON.stringify(data),
  //         },
  //       );
  //       const result = await resp.json();
  //       if (result?.data?.attributes?.accessToken) {
  //         localStorage.setItem("status", "true")
  //         localStorage.setItem("token", result?.data?.attributes?.accessToken)
  //       } else {
  //         localStorage.setItem("status", "false")
  //         router.push('/login')
  //       }
  //     } catch (err) {
  //       localStorage.setItem("status", "false")
  //       router.push('/login')
  //     }
  //   } else {
  //     localStorage.setItem("status", "false")
  //   }

  // }
  // useEffect(() => {
  //   checkTokenExpiry();
  // }, [authToken])

  const getSearchResult = async (text: any) => {
    try {
      const resp = await fetch(
        `${API_URL}/catalog-search-suggestions?q=${text}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await resp.json();
      setSearchResult(result?.data[0]?.attributes?.abstractProducts);
    } catch (error) {
      console.error("Error while fetching search results:", error);
    }
  };

  useEffect(() => {
    getSearchResult(searchText);
  }, [searchText]);

  const dropdownStyle: any = {
    position: "relative",
    display: "inline-block",
  };

  const buttonStyle: any = {
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  };

  const contentStyle: any = {
    display: isHovered ? "block" : "none",
    position: "absolute",
    backgroundColor: "#fff",
    color: "#333333",
    minWidth: "200px",
    padding: "10px",
    boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  };

  const contentStyle1: any = {
    display: isHovered1 ? "block" : "none",
    position: "absolute",
    backgroundColor: "#fff",
    color: "#333333",
    minWidth: "200px",
    padding: "10px",
    boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseEnter1 = () => {
    setIsHovered1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };

  //logout
  console.log(category, onTop, "category");

  const logout = () => {
    localStorage.clear();
    setAuthStatus("false");
    localStorage.setItem("status", "false");
    window.location.href = "/";
  };
  return (
    <header
      style={{ padding: "28px 104px 0px" }}
      className={`site-header site-header--fixed`}
    >
      <div className="container" style={{ flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Link href="/">
            <a>
              <h1 className="site-logo">
                <img
                  style={{ height: "41px" }}
                  src="https://www.ricoh.com/-/Media/Ricoh/Common/cmn_g_header_footer/img/logo/logo.svg"
                />
              </h1>
            </a>
          </Link>
          <div className="site-header__actions">
            {/* search */}
            <button
              ref={searchRef}
              className={`search-form-wrapper ${
                searchOpen ? "search-form--active" : ""
              }`}
            >
              <form className={`search-form`}>
                <i
                  className="icon-cancel"
                  onClick={() => setSearchOpen(searchOpen)}
                ></i>
                <input
                  type="text"
                  name="search"
                  onChange={(e: any) => {
                    setSearchText(e.target.value);
                  }}
                  placeholder="Enter the product you are looking for"
                />
              </form>
              {searchText ? (
                <Link href={`/search/${searchText}`}>
                  <i
                    onClick={() => setSearchOpen(searchOpen)}
                    className="icon-search"
                  ></i>
                </Link>
              ) : (
                <i
                  onClick={() => setSearchOpen(searchOpen)}
                  className="icon-search"
                ></i>
              )}
            </button>
            {/* contact */}
            <Link href="#">
              <a style={{ paddingLeft: "1rem" }} className="headerDummyTags">
                Contact
              </a>
            </Link>
            <Link href="#">
              <a className="headerDummyTags">Locations</a>
            </Link>
            <Link href="#">
              <a className="headerDummyTags">Careers</a>
            </Link>
            <Link href="#">
              <a className="headerDummyTags">
                <span style={{ fontSize: "14px" }}>{">"}</span> My Ricoh
              </a>
            </Link>
            {/* cart */}
            <Link href="/cart">
              <button
                className="btn-cart"
                style={{ borderLeft: "1px solid black", paddingLeft: "12px" }}
              >
                <i className="icon-cart"></i>
                {cartItems.length > 0 && (
                  <span className="btn-cart__count">{cartItems.length}</span>
                )}
              </button>
            </Link>
            {/* user */}
            <Link href={authStatus === "true" ? "/profile" : "/login"}>
              <button className="site-header__btn-avatar">
                <i className="icon-avatar"></i>
              </button>
            </Link>
            {/* login */}
            <div>
              {authStatus === "false" ? (
                <Link href="/login">
                  <button>Login</button>
                </Link>
              ) : (
                <button onClick={() => logout()}>Logout</button>
              )}
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="site-header__btn-menu"
            >
              <i className="btn-hamburger">
                <span></span>
              </i>
            </button>
          </div>
        </div>
        <nav
          ref={navRef}
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
        >
          {/* {category.map((item: any) => {
            return (
              <Link href={`/productList/${item?.url?.split('/')[2]}?nodeId=${item.nodeId}`}>
                <a>{item.name}</a>
              </Link>
            )
          })} */}
          <Link href="#">
            <a>Solutions</a>
          </Link>

          <div
            style={dropdownStyle}
            onMouseEnter={handleMouseEnter1}
            onMouseLeave={handleMouseLeave1}
          >
            <button style={buttonStyle}>
              <a>Printers & Products</a>
            </button>
            <div style={contentStyle1}>
              {!customerGroup ? (
                <>
                <div>
                  <Link href={`/productList/ink-&-toner?nodeId=43`}>
                    <a style={{ color: "black", padding: "5px" }}>
                      Ink & Toner
                    </a>
                  </Link>
                  </div>
                  <div>
                  <Link href={`/productList/ricoh?nodeId=39`}>
                    <a style={{ color: "black", padding: "5px" }}>Printers</a>
                  </Link>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* {customerGroup == "DE--5" && (
                <Link href={`/productList/ink-&-toner?nodeId=43`}>
                <a style={{ color: "black", padding: "5px" }}>Ink & Toner</a>
              </Link>
              <Link href={`/productList/ricoh?nodeId=39`}>
                <a className="printer" style={{ color: "black", padding: "5px" }}>Printers</a>
              </Link>
              </> :""} */}
              {customerGroup == "DE--5" &&
              <Link href={`/productList/ink-&-toner?nodeId=43`}>
                <a style={{ color: "black", padding: "5px" }}>Ink & Toner</a>
              </Link>}
              {customerGroup == "DE--6" &&
              <Link href={`/productList/ink-&-toner?nodeId=43`}>
                <a style={{ color: "black", padding: "5px" }}>Ink & Toner</a>
              </Link>}
              {customerGroup == "DE--7" &&
              <Link href={`/productList/ricoh?nodeId=39`}>
                <a style={{ color: "black", padding: "5px" }}>Printers</a>
              </Link>}
              {customerGroup == "DE--15" &&
              <Link href={`/productList/ricoh?nodeId=39`}>
                <a style={{ color: "black", padding: "5px" }}>Printers</a>
              </Link>}
              {customerGroup == "DE--21" &&
              <Link href={`/productList/ricoh?nodeId=39`}>
                <a style={{ color: "black", padding: "5px" }}>Printers</a>
              </Link>}
            </div>
          </div>
          {authStatus === "false" ? (
            ""
          ) : (
            <div
              style={dropdownStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button style={buttonStyle}>
                <a>Bundles</a>
              </button>
              <div style={contentStyle}>
                <Link href={`/bundle`}>
                  <a style={{ color: "black", padding: "5px" }}>
                    Bundle Product
                  </a>
                </Link>
                <Link href={`/configurable-product`}>
                  <a style={{ color: "black", padding: "5px" }}>
                    Configurable Product
                  </a>
                </Link>
              </div>
            </div>
          )}

          <Link href="#">
            <a>Software & Services</a>
          </Link>
          <Link href="#">
            <a>Resources</a>
          </Link>
          <Link href="#">
            <a>Support & Downloads</a>
          </Link>
          <Link href="#">
            <a>About us</a>
          </Link>

          <button className="site-nav__btn">
            <p>Account</p>
          </button>
        </nav>
      </div>
      {searchResult.length > 0 ? (
        <div
          className="searchParent"
          style={{
            top: "4.5rem",
            left: "27.5rem",
            borderRadius: "5px",
            position: "absolute",
            maxWidth: "30rem",
            overflowY: "auto",
            maxHeight: "400px",
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            zIndex: "9999",
          }}
        >
          {searchResult.map((item: any) => (
            <Link
              href={`/product/${item.abstractName}?skuId=${item.abstractSku}`}
              key={item.abstractSku}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                <div style={{ paddingLeft: "10px" }}>
                  <img
                    src={item.images[0].externalUrlLarge}
                    style={{
                      width: "83px",
                      height: "83px",
                      objectFit: "contain",
                      // border: "1px solid #7f7f7f",
                      // borderRadius: "100%",
                    }}
                    alt="product"
                  />
                </div>
                <div style={{ padding: "10px" }}>
                  <p
                    style={{
                      color: "black",
                      margin: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.abstractName}
                  </p>
                  <p style={{ color: "black", margin: "5px" }}>
                    ID : {item.abstractSku}
                  </p>
                  <p style={{ color: "#800000", margin: "5px" }}>
                    $ {item.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
