import { SignOutButton, useAuth, useUser } from "@clerk/clerk-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isMenuScrollable, setIsMenuScrollable] = useState(false);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const { pathname } = useLocation();
  const { isSignedIn, user } = useUser();
  const { userId } = useAuth();

  const menuRef = useRef(null);
  const userTriggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  const checkScroll = useCallback(() => {
    const menu = menuRef.current;
    if (menu) {
      if (window.innerWidth >= 768) {
        const scrollable = menu.scrollWidth > menu.clientWidth;
        setIsMenuScrollable(scrollable);
        if (scrollable) {
          const scrollEnd = menu.scrollWidth - menu.clientWidth - 1;
          setIsScrolledToStart(menu.scrollLeft <= 1);
          setIsScrolledToEnd(menu.scrollLeft >= scrollEnd);
        } else {
          setIsScrolledToStart(true);
          setIsScrolledToEnd(true);
        }
      } else {
        setIsMenuScrollable(false);
        setIsScrolledToStart(true);
        setIsScrolledToEnd(true);
      }
    } else {
      setIsMenuScrollable(false);
      setIsScrolledToStart(true);
      setIsScrolledToEnd(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
      checkScroll();
    };
    window.addEventListener("resize", handleResize);
    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener('scroll', checkScroll);
    }
    checkScroll();
    return () => {
      window.removeEventListener("scroll", isActive);
      window.removeEventListener("resize", handleResize);
      if (menuElement) {
        menuElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, [checkScroll, active, pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenUserDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userTriggerRef.current &&
        !userTriggerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenUserDropdown(false);
      }
    };
    if (openUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openUserDropdown]);

  const currentUser = isSignedIn
    ? {
        id: userId,
        username: user?.username || user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0] || "user",
        isSeller: user?.publicMetadata?.isSeller || false,
        isAdmin: user?.publicMetadata?.isAdmin || false,
        avatar: user?.imageUrl || "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600",
      }
    : null;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setOpenUserDropdown(false);
    }
  };

  const toggleUserDropdown = () => {
    setOpenUserDropdown(prev => !prev);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setOpenUserDropdown(false);
  };

  const handleScroll = (direction) => {
    const menu = menuRef.current;
    if (menu) {
      const scrollAmount = menu.clientWidth * 0.8;
      menu.scrollLeft += (direction === 'left' ? -scrollAmount : scrollAmount);
      setTimeout(checkScroll, 350);
    }
  };

  const categories = [
    { name: "Graphics & Design", path: "/" },
    { name: "Programming & Tech", path: "/" },
    { name: "Digital Marketing", path: "/" },
    { name: "Video & Animation", path: "/" },
    { name: "Writing & Translation", path: "/" },
    { name: "Music & Audio", path: "/" },
    { name: "Business", path: "/" },
    { name: "AI Services", path: "/" },
    { name: "Lifestyle", path: "/" },
    { name: "Photography", path: "/" },
    { name: "Data", path: "/" },
    { name: "Consulting", path: "/" },
   ];

  return (
    <div className={`navbar ${active || pathname !== "/" ? "active" : ""} ${mobileMenuOpen ? "mobile-menu-active" : ""}`}>
      <div className="container">
        <div className="hamburger-icon" onClick={toggleMobileMenu}>
           <div className="line line1"></div>
           <div className="line line2"></div>
           <div className="line line3"></div>
        </div>
        <div className="logo">
          <Link className="link" to="/" onClick={handleLinkClick}>
            <span className="text">liverr</span>
            <span className="dot">.</span>
          </Link>
        </div>
        <div className="links">
          <span>Liverr Business</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && !currentUser?.isAdmin && (
            <span>Become a Seller</span>
          )}
          {currentUser ? (
            <div className="user" ref={userTriggerRef} onClick={toggleUserDropdown}>
              <img src={currentUser.avatar} alt="" />
              <span>{currentUser.username}</span>
              {openUserDropdown && (
                <div className="options" ref={dropdownRef}>
                  <Link className="link" to="/profile" onClick={handleLinkClick}>
                    <span>Profile</span>
                  </Link>
                  {currentUser.isAdmin && (
                    <>
                      <Link className="link" to="/admin" onClick={handleLinkClick}>
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                  {(currentUser.isSeller || currentUser.isAdmin) && (
                    <>
                      <Link className="link" to="/mygigs" onClick={handleLinkClick}>
                        Gigs
                      </Link>
                      <Link className="link" to="/add" onClick={handleLinkClick}>
                        Add New Gig
                      </Link>
                    </>
                  )}                 
                  <Link className="link" to="/orders" onClick={handleLinkClick}>
                    Orders
                  </Link>
                  <Link className="link" to="/messages" onClick={handleLinkClick}>
                    Messages
                  </Link>
                  <SignOutButton>
                    <button className="link-button" onClick={handleLinkClick}>
                      Logout
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="link hover-text" to="/login" onClick={handleLinkClick}>
                <span>Sign in</span>
              </Link>
              <Link className="link" to="/register" onClick={handleLinkClick}>
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {(active || pathname !== "/") && (
        <div className="secondary-menu-desktop">
          <div className="secondary-menu-container">
            {isMenuScrollable && !isScrolledToStart && (
              <button className="scroll-btn left" onClick={() => handleScroll('left')}>
                &lt;
              </button>
            )}
            <div className="menu" ref={menuRef}>
              {categories.map((cat) => (
                <Link key={cat.name} className="link menuLink" to={cat.path}>
                  {cat.name}
                </Link>
              ))}
            </div>
            {isMenuScrollable && !isScrolledToEnd && (
              <button className="scroll-btn right" onClick={() => handleScroll('right')}>
                &gt;
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMobileMenu}>X</button>
        <div className="mobile-menu-content">
          <div className="mobile-user-section">
            {currentUser ? (
              <div className="user-info">
                <img src={currentUser.avatar} alt="" />
                <span>{currentUser.username}</span>
                <Link className="profile-link" to="/profile" onClick={handleLinkClick}>
                  View Profile
                </Link>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link className="link" to="/register" onClick={handleLinkClick}>
                  <button className="join-btn-mobile">Join Fiverr</button>
                </Link>
                <Link className="link signin-link-mobile" to="/login" onClick={handleLinkClick}>
                  Sign in
                </Link>
              </div>
            )}
          </div>
          <hr className="mobile-separator"/>
          <nav className="mobile-main-links">
            <Link to="/business" onClick={handleLinkClick}>Liverr Business</Link>
            <Link to="/explore" onClick={handleLinkClick}>Explore</Link>
            {!currentUser?.isSeller && !currentUser?.isAdmin && (
              <Link to="/start_selling" onClick={handleLinkClick}>Become a Seller</Link>
            )}
            {currentUser && (
              <>
                {(currentUser.isSeller || currentUser.isAdmin) && (
                  <>
                    <Link to="/mygigs" onClick={handleLinkClick}>Gigs</Link>
                    <Link to="/add" onClick={handleLinkClick}>Add New Gig</Link>
                  </>
                )}
                {currentUser.isAdmin && (
                  <Link to="/admin" onClick={handleLinkClick}>Admin Dashboard</Link>
                )}
                <Link to="/orders" onClick={handleLinkClick}>Orders</Link>
                <Link to="/messages" onClick={handleLinkClick}>Messages</Link>
              </>
            )}
          </nav>
          <hr className="mobile-separator"/>
          {(active || pathname !== "/") && (
             <nav className="mobile-secondary-links">
               <div className="category-title">Categories</div>
               {categories.map((cat) => (
                 <Link key={cat.name} className="link menuLink" to={cat.path} onClick={handleLinkClick}>
                   {cat.name}
                 </Link>
               ))}
             </nav>
           )}
          {currentUser && (
            <div className="mobile-logout">
              <SignOutButton>
                <button className="mobile-logout-button" onClick={handleLinkClick}>
                  Logout
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && <div className="overlay" onClick={toggleMobileMenu}></div>}
    </div>
  );
}
export default Navbar;