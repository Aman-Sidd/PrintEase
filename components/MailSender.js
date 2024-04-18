import React from "react";
import { Button } from "react-native";
import Mailer from "react-native-mail";

const MailSender = () => {
  const sendMail = () => {
    Mailer.mail(
      {
        subject: "Subject",
        recipients: ["amansidd.official@gmail.com"],
        ccRecipients: ["cc@example.com"],
        bccRecipients: ["bcc@example.com"],
        body: "Body",
        isHTML: true,
      },
      (error, event) => {
        if (error) {
          console.error("Error: ", error);
        }
      }
    );
  };

  return <Button title="Send Mail" onPress={sendMail} />;
};

export default MailSender;
