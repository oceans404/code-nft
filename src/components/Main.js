import React, { useState, useEffect } from "react";
import Button from "muicss/lib/react/button";
import html2canvas from "html2canvas";
import axios from "axios";
import { Modal } from "@mui/material";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";
import { truncateAddress } from "../helpers";

function Main(props) {
  const demoHTML = `<div class="container">
  <h1>welcome to cOoOde! 👩🏻‍💻</h1>
  <p>tap into your creative side! 🎨 cOoOde a One of One piece with HTML and CSS and MINT it as an NFT to share your art with the world. 🌐</p>
  <br/><br/><br/><br/><br/><br/>
  <div>
    <i class="star"></i>
    <i class="star"></i>
    <i class="star"></i>
    <i class="star"></i>
    <i class="star"></i>
  </div>
</div>`;

  const defaultHTML = (showExtras) => `<div id="cOoOde-nft">

${showExtras ? demoHTML : ``}

</div>`;

  const demoCSS = `.container {
    margin: 60px 30px;
  	display: flex;
    flex-wrap: wrap;
  	align-items: center;
  	justify-content: center;
}

/** Pure CSS star: https://codepen.io/fxm90/pen/yOBWVe **/
.star {
    position: relative;
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: .9em;
    margin-right: .9em;
    margin-bottom: 1.2em;
    border-right:  .3em solid transparent;
    border-bottom: .7em  solid white;
    border-left:   .3em solid transparent;
    /* Controlls the size of the stars. */
    font-size: 24px;
  }
  
.star:before, .star:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    top: .6em;
    left: -1em;
    border-right:  1em solid transparent;
    border-bottom: .7em  solid white;
    border-left:   1em solid transparent;
    transform: rotate(-35deg);
}
    
.star:after {  
    transform: rotate(35deg);
}`;

  const defaultCSS = (showExtras) => `#cOoOde-nft {
    background: ${
      showExtras
        ? "linear-gradient(45deg, #006163, #CCCCFF, #87D8C3)"
        : "#e2e2e2"
    };
    color: white;
}

${showExtras ? demoCSS : ``}
`;
  const { isAuthenticated } = props;
  const [html, setHtml] = useLocalStorage("html", defaultHTML(true));
  const [css, setCss] = useLocalStorage("css", defaultCSS(true));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [nftImgSrc, setNftImgSrc] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [showCode, setShowCode] = useState(true);

  const nftPortKey = process.env.REACT_APP_NFT_PORT_KEY;

  const handleSubmit = (evt) => {
    evt.preventDefault();

    fetch("https://api.nftport.xyz/v0/mints/easy/urls", {
      method: "POST",
      headers: {
        Authorization: nftPortKey,
      },
      body: JSON.stringify({
        chain: "polygon",
        name,
        description: `cOoOde by ${address}`,
        file_url: ipfsUrl,
        mint_to_address: address,
      }),
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (responseJson) {
        // Handle the response
        console.log(responseJson);
        setTransactionDetails(responseJson);
        setIsModalOpen(false);
        setShowCode(false);
      });
    // });
  };

  const resetToDefaults = (withExtras) => {
    setHtml(defaultHTML(withExtras));
    setCss(defaultCSS(withExtras));
  };

  const pinFile = async (imgsrc) => {
    const formData = new FormData();

    // append the file form data to
    formData.append("file", imgsrc);

    // the endpoint needed to upload the file
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const response = await axios.post(url, formData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
        pinata_api_key: process.env.REACT_APP_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_API_SECRET,
      },
    });
    const fileUrl = `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
    setIpfsUrl(fileUrl);
    console.log(fileUrl);
  };

  async function createFile(src) {
    let response = await fetch(src);
    let data = await response.blob();
    let metadata = {
      type: "image/png",
    };
    let file = new File([data], "test.png", metadata);
    console.log(file);
    pinFile(file);
  }

  const mintNFT = () => {
    console.log("minting...");
    setIsModalOpen(true);

    html2canvas(document.querySelector("#cOoOde-nft")).then((canvas) => {
      let image = new Image();
      image.src = canvas.toDataURL("image/png", 1.0);
      image.width = "450";
      image.height = "450";
      image.id = "nftImage";

      setNftImgSrc(image);

      createFile(image.src);

      const holderdiv = document.getElementById("imgHolderDiv");
      holderdiv.appendChild(image);
      // return image;
    });
  };

  return (
    <div className="pane pane-code">
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modalContainer">
          <h1>Mint your NFT</h1>
          <div id="imgHolderDiv"></div>
          <form onSubmit={handleSubmit}>
            <label>
              NFT Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Wallet address for mint
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <input type="submit" value="MINT!" />
          </form>
        </div>
      </Modal>

      {showCode && (
        <div className="thirds">
          <Editor
            language="xml"
            displayName="html"
            value={html}
            onChange={setHtml}
          />
        </div>
      )}
      {showCode && (
        <div className="thirds">
          <Editor
            language="css"
            displayName="css"
            value={css}
            onChange={setCss}
          />
        </div>
      )}

      <div className="thirds thirds-nft">
        <div>
          <h2 className="cta">
            {showCode
              ? "Code a cOoOL One of One"
              : `Successfully minted "${name}" by ${truncateAddress(address)}`}
          </h2>
          {!showCode && transactionDetails && (
            <div>
              <div>
                Transaction:{" "}
                <a
                  href={transactionDetails.transaction_external_url}
                  target="_blank"
                >
                  {transactionDetails.transaction_external_url}
                </a>
              </div>

              <div>
                Opensea:{" "}
                <a href={`https://opensea.io/${address}`} target="_blank">
                  https://opensea.io/{address}
                </a>
              </div>
            </div>
          )}
        </div>

        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: `${html} 
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400&display=swap');
          body {
              font-family: Poppins;
          }
          ${css}
      </style>
          
          `,
            }}
          ></div>
        </div>

        {showCode && (
          <div>
            <Button onClick={() => resetToDefaults(false)}>Clear code</Button>
            <Button onClick={() => resetToDefaults(true)}>Reset demo</Button>
            <Button
              className="btn-mint"
              // disabled={!isAuthenticated}
              onClick={() => mintNFT()}
            >
              Mint NFT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
