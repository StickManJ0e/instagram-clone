import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { collection, query, where, getDocs, limit, } from "firebase/firestore";
import '../../styles/nav/NavbarSearchMenu.css';
import { useNavigate } from "react-router-dom";

const NavbarSearchMenu = (props) => {
    const { setNavbarPopup, setNavbarStyling } = props;
    const [resultAccounts, setResultAccounts] = useState();
    const navigate = useNavigate();

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
    };

    const onSearch = async (e) => {
        const searchValue = e.target.value;
        const searchQuery = query(collection(firestore, "users"), where('username', '>=', searchValue), where('username', '<=', searchValue + '\uf8ff'), limit(10));
        const querySnapshot = await getDocs(searchQuery);
        let queryArray = [];
        querySnapshot.forEach((document) => {
            queryArray.push({ ...document.data(), id: document.id });
            setResultAccounts(queryArray);
            console.log(queryArray);
        });
    };

    const onProfileClick = (account) => {
        navigate(`/profile/${account.username}`);
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
            <input type="text" id="search-bar" onChange={(e) => onSearch(e)}></input>
            <div>
                {(resultAccounts) ? resultAccounts.map((account) => {
                    return (
                        <div key={account.id} className="search-account" onClick={() => onProfileClick(account)}>
                            <img className="search-profile-picture" src={account.photoUrl} alt="profile" />
                            <div>{account.username}</div>
                        </div>
                    )
                }) : ''}
            </div>
        </div>
    );
};

export default NavbarSearchMenu;