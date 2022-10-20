import React from "react";
import Appbar from "muicss/lib/react/appbar";
import Button from "muicss/lib/react/button";
import { useMoralis } from "react-moralis";
import Main from "./components/Main";
import { truncateAddress } from "./helpers";

function App(props) {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const tableStyle = { margin: "0 auto" };
  const s1 = { verticalAlign: "middle" };
  const s2 = { textAlign: "right" };

  return (
    <div>
      <Appbar>
        <table width="95%" style={tableStyle}>
          <tbody>
            <tr style={s1}>
              <td className="mui--appbar-height">
                <h1>cOoOde</h1>
              </td>
              {/* <td className='mui--appbar-height' style={s2}>
                {!isAuthenticated ? (
                  <Button onClick={() => authenticate()}>
                    Connect wallet to enable minting
                  </Button>
                ) : (
                  <span>Welcome {truncateAddress(user.get('ethAddress'))}</span>
                )}
              </td> */}
            </tr>
          </tbody>
        </table>
      </Appbar>
      <Main
        isAuthenticated={isAuthenticated}
        address={user && user.get("ethAddress")}
      />
    </div>
  );
}

export default App;
