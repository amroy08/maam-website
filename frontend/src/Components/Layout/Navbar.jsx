import {Link} from 'react-router-dom'
import {navItems} from '../../Static/Data.jsx'

 
const Navbar = ({active}) => {
    return (
        <nav className=" 800px:flex items-center"> {/* Ensures horizontal alignment */}
            <ul className="flex items-center gap-x-6"> {/* Horizontal list with spacing */}
                {navItems &&
                    navItems.map((i, index) => (
                        <li key={index}> {/* Use key to prevent warnings */}
                            <Link
                                to={i.url}
                                className={`${
                                    active === index + 1 ? "text-pink-400 font-bold text-xl drop-shadow-sm" : "text-white text-lg 800px:text-[#fff]"
                                } font-[500] px-4 cursor-pointer`}
                            >
                                {i.title}
                            </Link>
                        </li>
                    ))}
            </ul>
        </nav>
    );
};

export default Navbar;
