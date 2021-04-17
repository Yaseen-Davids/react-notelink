import React, { useContext, useState } from "react";

import { login } from "../../lib/user";
import { UserContext } from "../../contexts/UserContext";
import { GoogleSignInButton } from "../../components/GoogleSignInButton";

import { Form, Field } from "react-final-form";
import { Input, Button, Divider } from "semantic-ui-react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

export const Login = () => {
  const history = useHistory();
  const { hydrateUser } = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <Container>
      <Form
        validate={(values: { username: string; password: string }) => {
          const errors: any = {};

          if (!values.username) {
            errors.username = "Please enter a username";
          }
          if (!values.password) {
            errors.password = "Please enter a password";
          }

          return errors;
        }}
        onSubmit={async (fields: { username: string; password: string }) => {
          try {
            setLoading(true);
            setError(undefined);
            const resp = await login({ ...fields });

            if (resp.status >= 400) {
              throw "Log in failed.";
            }

            const token = resp.data.token;
            localStorage.setItem("login-token", token);

            await hydrateUser();
            await history.replace("/");
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <LoginWrapper>
              <LoginContent>
                <LoginContainerHeaderWrapper>
                  <h2>Login to your account</h2>
                </LoginContainerHeaderWrapper>
                <FieldContainerWrapper>
                  <TextField type="text" name="username" label="Username" />
                  <TextField type="password" name="password" label="Password" />
                  <div
                    style={{
                      height: "45px",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <Button
                      fluid
                      inverted
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Login
                    </Button>
                  </div>
                  <RegisterWrapper>
                    <a href="#">Don't have an account? Register</a>
                  </RegisterWrapper>
                  <div>
                    <Divider horizontal inverted>
                      OR
                    </Divider>
                  </div>
                  <GoogleSignInButton />
                </FieldContainerWrapper>
                {error && <p className="validate-error">{error}</p>}
              </LoginContent>
            </LoginWrapper>
          </form>
        )}
      />
    </Container>
  );
};

type TextFieldProps = {
  type: string;
  name: string;
  label: string;
};

const TextField: React.FC<TextFieldProps> = ({ type, name, label }) => (
  <Field
    type={type}
    name={name}
    render={({ meta, input }) => (
      <FieldContainer>
        <label>{label}</label>
        <DarkInput {...input} autoComplete="off" fluid />
        {meta.error && meta.touched ? (
          <span className="validate-error">{meta.error}</span>
        ) : (
          <></>
        )}
      </FieldContainer>
    )}
  />
);

const Container = styled.div`
  max-height: 100vh;
  height: 100vh;
  background-color: #121212;

  .validate-error {
    color: #ff2b2b;
    font-size: 10px;
  }
`;

const LoginContainerHeaderWrapper = styled.div`
  color: #d4d4d4;
  width: 100%;
  text-align: center;
`;

const LoginWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
`;

const LoginContent = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
  background-color: #1f1f1f;
  border: 1px solid #181818;
  h2 {
    color: #d4d4d4;
  }
`;

const FieldContainerWrapper = styled.div`
  display: grid;
  row-gap: 10px;
`;

const FieldContainer = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr 10px;
  label {
    color: #d4d4d4;
  }
  &&&&& input {
    margin-top: 5px;
    margin-bottom: 5px;
  }
`;

const DarkInput = styled(Input)`
  &&&& input {
    background-color: #333;
    color: #d4d4d4;
  }
`;

const RegisterWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 25px;
  a {
    color: #d4d4d4;
    font-size: 12px;
  }
`;
