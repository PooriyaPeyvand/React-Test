import Styled from "styled-components";
import {Link} from "react-router-dom";

const StyledHeader = Styled.header`

nav {
        height : 50px;
        padding : 10px;
        transition: all 0.4s;
        a {
          text-decoration : none;
          color : #023e8a;
          font-weight : 600;
          font-size : 17px
        }
    }
    
    nav .nav-link:hover,
    nav .nav-link:focus {
        color: #000;
        text-decoration: none;
    }
    
    
    /* Change navbar styling on small viewports */
    @media (max-width: 991.98px) {
        .navbar {
            background: #fff;
        }
    
        .navbar .navbar-brand, .navbar .nav-link {
            color: #555;
        }
    }
    
    
`;

export default function Header() {
  const navLinks = [
    {
      name: "Products",
      link: "/products",
    },
  ];
  return (
    <StyledHeader>
      <nav className="flex items-center">
        <ul className="flex items-center">
          {navLinks.map(link => (
            <Link key={link.name} to={link.link}>
              {link.name}
            </Link>
          ))}
        </ul>
      </nav>
    </StyledHeader>
  );
}
