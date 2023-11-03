import React, { useEffect, useState, useCallback } from "react";
import styles from "./SettingsPage.module.css";
import { Page, Text, Frame, Toast } from "@shopify/polaris";
import { Button } from "@mui/material";
import { isAuthErrorVisibleAtom, serverKeyAtom } from "../recoilStore/store";
import { useRecoilState } from "recoil";
import { useNavigate } from "raviger";
import useFetch from "../hooks/useFetch";
import { CircularProgress } from "@mui/material";
import AlertBanner from "../components/alert/Alert";

export default function SettingsPage() {
  const [isServerKeyErrorVisible, setServerKeyErrorVisible] = useRecoilState(
    isAuthErrorVisibleAtom
  );
  const navigate = useNavigate();
  const [isEditVisible, setIsEditVisible] = useState(true);
  const [isTextareaEnabled, setIsTextareaEnabled] = useState(false);
  const [serverKey, setServerKey] = useRecoilState(serverKeyAtom);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast
      content="Server Key Updated"
      error={false}
      onDismiss={toggleActive}
    />
  ) : null;

  const getServerKey = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  const postOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ serverKey: serverKey }),
  };
  const useDataFetcher = (initialState, url, options) => {
    const [data, setData] = useState(initialState);
    const fetch = useFetch();

    const fetchData = async () => {
      setData("");
      const result = await (await fetch(url, options)).json();
      console.log(result);
      if ("serverKey" in result) setData(result.serverKey);
      else if ("message" in result) setData(result.message);
    };
    return [data, fetchData];
  };

  const [serverKeyPost, postServerKey] = useDataFetcher(
    "",
    "/api/updateServerKey",
    postOptions
  );
  const [responseServerKey, fetchServerKey] = useDataFetcher(
    "",
    "/api/getServerKey",
    getServerKey
  );

  const handleEdit = () => {
    setIsEditVisible(false);
    setIsTextareaEnabled(true);
  };
  const handleSave = () => {
    setLoading(true);
    setIsTextareaEnabled(false);
    postServerKey();
  };
  const handleCancel = () =>{
    setIsEditVisible(true);
    setIsTextareaEnabled(false);
    fetchServerKey();
  setIsSaveDisabled(false)
  }
  

  
  useEffect(() => {
    //useEffect to fetch Server Key
    setServerKeyErrorVisible(false);
    if(!serverKey){
      fetchServerKey();
      setServerKey(responseServerKey);
    }
  }, []);
  useEffect(() => {
    if (serverKeyPost === "ServerKey set Succeessufull") {
      toggleActive();
      setIsEditVisible(true);
      setLoading(false);
    } else if (serverKeyPost === "Failure to update ServerKey") {
      setServerKeyErrorVisible(true);
    }
  }, [serverKeyPost]);
  useEffect(() => {
    //useEffect to update serverKey state once the key is fetched
    if(serverKey.length!==152)
    setServerKey(responseServerKey);
  }, [responseServerKey]);

  useEffect(() => {
    //useEffect to toggle the disability of save button
    if (isEditVisible == false) {
      if (serverKey.length === 152) {
        setIsSaveDisabled(false);
      } else {
        setIsSaveDisabled(true);
      }
    }
  }, [serverKey]);
  return (
    <div>
      <Page
        title="Settings"
      >
        {isServerKeyErrorVisible && (
          <AlertBanner
            alertMessage={"Failed to Update Server Key, please try again."}
            alertTitle={"Error Updating Server Key!"}
          />
        )}
        <Frame>
          <div className={styles.container}>
            <div className={styles.heading}>
              <Text as="h1" variant="headingXl">
                Firebase Server Key
              </Text>
              <Text variant="headingMd" as="h6">
                Update your Firebase Service Key
              </Text>
            </div>
            <div className={styles.body}>
              <textarea
                className={styles.serviceKeyField}
                rows={5}
                maxLength={152}
                value={serverKey?serverKey:"Loading..."}
                onChange={(e) => setServerKey(e.target.value)}
                disabled={!isTextareaEnabled}
              />
              {isSaveDisabled && (
                <span className={styles.errorMessage}>
                  Please enter a valid Server Key
                </span>
              )}
              {isEditVisible ? (
                <Button
                  id={styles.editBtn}
                  variant="contained"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              ) : (<div>
              <Button
              id={styles.cancelBtn}
              onClick={handleCancel}
              >Cancel</Button>
                <Button
                  id={styles.saveBtn}
                  disabled={isSaveDisabled}
                  variant="contained"
                  onClick={handleSave}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
              )}
            </div>
          </div>
          {toastMarkup}
        </Frame>
      </Page>
    </div>
  );
}
