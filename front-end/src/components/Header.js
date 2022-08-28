import react, { useContext } from "react";
import { Link } from "react-router-dom";
import { useEthers, useEtherBalance } from "@usedapp/core";

const Header = () => {

    const {activateBrowserWallet, account} = useEthers();
    const etherBalance = useEtherBalance(account);

    const handleWallet = () => {
      activateBrowserWallet();

    }

    return (
        <div id="header">
        <Link to='/' id='logo'>DAO Plex</Link>

        <div id="link-containers">
          <Link to="/explore" style={{textDecoration:"none"}}>Explore</Link>
          <Link to="/create" style={{textDecoration:"none"}}>Register DAO</Link>

          <button id="connect-wallet" onClick={handleWallet} >{!account ? 'Connect Wallet' : account}</button>
        </div>
      </div>
    );
}

export default Header;