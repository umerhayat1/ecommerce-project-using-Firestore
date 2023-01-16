import React, { useState } from "react";
import { storage, db } from "../config/Config";
export const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState("");

  const types = ["image/png", "image/jpeg"];

  const productImgHandler = (e) => {
    let selectedFile = e;
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError("");
    } else {
      setProductImg(null);
      setError("please select valid image type.");
    }
  };

  const addProduct = (e) => {
    e.preventDefault();
    // console.log(productName, productPrice, productImg);
    const uploadTask = storage
      .ref(`product-images/${productImg.name}`)
      .put(productImg);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (err) => {
        setError(err.message);
      },
      () => {
        storage
          .ref("product-images")
          .child(productImg.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("Products")
              .add({
                ProductName: productName,
                ProductPrice: Number(productPrice),
                ProductImg: url,
              })
              .then(() => {
                setProductName("");
                setProductPrice(0);
                setProductImg("");
                setError("");
                document.getElementById("file").value = "";
              })
              .catch((err) => setError(err.message));
          });
      }
    );
  };
  return (
    <div className="container">
      <br />
      <h2>ADD PRODUCTS</h2>
      <br />
      <form
        autoComplete="off"
        action=""
        className="form-group"
        onSubmit={addProduct}
      >
        <label htmlFor="product-name">Product Name </label>
        <br />
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setProductName(e.target.value)}
          value={productName}
        ></input>
        <br />
        <label htmlFor="product-price">Product Price </label>
        <br />
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setProductPrice(e.target.value)}
          value={productPrice}
        ></input>
        <br />
        <label htmlFor="product-image">Product Image</label>
        <br />
        <input
          type="file"
          className="form-control"
          //   onChange={productImgHandler}
          onChange={(e) => productImgHandler(e.target.files[0])}
          id="file"
        ></input>
        <br />
        <button className="btn btn-success btn-md mybtn">Add</button>
      </form>
      {error && <span>{error}</span>}
    </div>
  );
};
