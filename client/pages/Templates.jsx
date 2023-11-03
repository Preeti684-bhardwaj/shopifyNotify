import React, { useEffect, useState } from "react";
import styles from "./Templates.module.css";
import { Page, Text, Tooltip } from "@shopify/polaris";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  serverKeyAtom,
  templateAtom,
  isLandingPageAlertVisibleAtom,
} from "../recoilStore/store";
import { useNavigate } from "raviger";
import useFetch from "../hooks/useFetch";

export default function Templates() {
  const setTemplate = useSetRecoilState(templateAtom);
  const navigate = useNavigate();
  const [serverKey, setServerKey] = useRecoilState(serverKeyAtom);
  const setIsLandingPageErrorVisible = useSetRecoilState(
    isLandingPageAlertVisibleAtom
  );

  const helperTextBasic =
    "Choose the 'Basic Notification' option to send a simple yet effective message to your customers. When clicked, this notification will direct users to your app's inviting landing page, providing them with a seamless experience to explore everything your app has to offer.";
  const helperTextProduct =
    "Opt for the 'Product-Specific Notification' to deliver targeted messages about specific products. This option enables you to provide personalized experiences for your customers. When clicked, this notification will take users directly to the detailed page of the mentioned product within your app, enhancing their engagement and encouraging swift actions.";
  const handleTemplateSelect = (temp) => {
    setTemplate(temp);
    navigate("/createNotification");
  };
  const useDataFetcher = (initialState, url, options) => {
    const [data, setData] = useState(initialState);
    const fetch = useFetch();

    const fetchData = async () => {
      setData("loading...");
      const result = await (await fetch(url, options)).json();
      if ("serverKey" in result) {
        setData(result.serverKey);
        console.log(result.serverKey);
      } else 
      {navigate("/");
      setIsLandingPageErrorVisible(true)
    }
    };

    return [data, fetchData];
  };
  const getServerKey = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const [responseServerKey, fetchServerKey] = useDataFetcher(
    "",
    "/api/getServerKey",
    getServerKey
  );
  useEffect(() => {
    if (serverKey.length !== 152) {
      console.log("Server Key not present", serverKey);
      fetchServerKey();
      setServerKey(responseServerKey)
    }
  }, []);
  return (
    <div>
      <Page>
        <div className={styles.container}>
          <div className={styles.head}>
            <Text as="h1" variant="headingXl">
              Template
            </Text>
            <Text variant="headingMd" id="subHeading">
              Please select a template for your notification
            </Text>
          </div>
          <div className={styles.body}>
            <Tooltip content={helperTextBasic} width="wide">
              <div
                className={styles.cardBasic}
                onClick={() => handleTemplateSelect("basic notification")}
              >
                <Text fontWeight="bold" as="h1" variant="headingXl">
                  Basic Notification
                </Text>
                <div className={styles.arrow}></div>
              </div>
            </Tooltip>
            <Tooltip content={helperTextProduct} width="wide">
              <div
                className={styles.cardProduct}
                onClick={() => handleTemplateSelect("product notification")}
              >
                <Text fontWeight="bold" as="h1" variant="headingXl">
                  {" "}
                  Notification for a specific product
                </Text>
              </div>
            </Tooltip>
          </div>
        </div>
      </Page>
    </div>
  );
}
