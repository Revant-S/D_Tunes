function generateSecureRandomString(length) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

const btn = document.querySelector(".dauthBtn");

function makeAuthCall() {
  const state = generateSecureRandomString(32);
  const nonce = generateSecureRandomString(32);
  const authUrl = new URL("https://auth.delta.nitt.edu/authorize");
  authUrl.searchParams.append("client_id", "aDGjBgG1bapKnzrM");
  authUrl.searchParams.append("redirect_uri", "http://localhost:5000/home");
  authUrl.searchParams.append("grant_type", "authorization_code");
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("scope", "email openid profile user");
  authUrl.searchParams.append("nonce", nonce);
  authUrl.searchParams.append("response_type", "code");
  localStorage.setItem("authState", state);
  localStorage.setItem("authNonce", nonce);
  window.location.href = authUrl.toString();
}


btn.addEventListener("click", (e) => {
  e.preventDefault();
  makeAuthCall();
});
