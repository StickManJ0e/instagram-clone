import React, { useEffect } from "react";
import '../../styles/nav/NavbarSearchMenu.css'

const NavbarSearchMenu = (props) => {
    const { setNavbarPopup, setNavbarStyling } = props;

    const addNavbarStyling = () => {
        setNavbarStyling({
            width: 'var(--navbar-narrow-width)',
            minwidth: 'var(--navbar-narrow-width)'
        });
    };

    const handleClickOutside = (e) => {
        let wrapper = document.querySelector('#search-menu-wrapper');
        let searchButton = document.querySelector('#search-button');
        if (!(wrapper.contains(e.target)) && e.target !== searchButton) {
            setNavbarPopup();
        };
    }

    useEffect(() => {
        addNavbarStyling();
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            setNavbarStyling();
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <div id="search-menu-wrapper">
            Search
        </div>
    );
};

export default NavbarSearchMenu;