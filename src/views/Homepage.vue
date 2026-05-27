<template>

    <header class="Navbar">
        <!--Software and SENAI logo-->
        <figure class="logoSection">
            <img src="./assets/logoPCC.png" width="90">
            <img src="./assets/logoSENAI.png" width="200">
        </figure>

        <nav class="Navlinks">
            <router-link to="./Login">
                <button class="signInB">
                    Sign in
                </button>
            </router-link>

            <router-link to="./Login">
                <button class="getStartedBHeader">
                    Get started
                    <img src="./assets/arrowGetStartedBHeader.png" width="20">
                </button>
            </router-link>
        </nav>
    </header>

    <main>
        <section class="mainText">
            <h1>
                Track and monitor personal protective equipment (PPE)
                <br>
                in real time, from any location worldwide.
            </h1>
        </section>

        <router-link to="./Login">
            <button class="getStartedBMain">
                Get started
                <img src="./assets/arrowGetStartedBMain.png" width="30">
            </button>
        </router-link>
    </main>

</template>


<script>
export default {
name: 'Homepage'
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Rubik:ital,wght@0,800;1,800&display=swap');

html,
body,
#app {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

a {
    text-decoration: none;
  color: inherit;
}

a:hover {
    text-decoration: none;
}

main {
    margin: 0;
    min-height: 100vh;
    background-image: url(./assets/background.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    max-width: 100%;
    display: block;
}

.Navbar{
    background-color: rgb(155, 201, 255);
    align-items: center;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    height: 90px;
}

.logoSection{
    align-items: center;
    display: flex;
    gap: 10px;
}

.Navlinks{
    align-items: center;
    display: flex;
    gap: 20px;
    padding: 20px;
}

.signInB{
    color: #363636;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 20px;
    transition: text-shadow 0.3s ease-in-out;
}

.signInB:hover{
    text-decoration: underline;
    text-shadow: 0.8px 0 0 currentColor;
}

.getStartedBHeader{
    color: #363636;
    background-color: #ffffff;
    align-items: center;
    display: flex;
    gap: 10px;
    border: none;
    cursor: pointer;
    padding: 20px 10px;
    border-radius: 7px;
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 20px;
    transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
}

.getStartedBHeader:hover{
    background-color: #e0e0e0;
    text-shadow: 0.7px 0 0 currentColor;
}

.getStartedBHeader:hover img {
    filter: drop-shadow(0.7px 0 0 currentColor);
}

.mainText{
    color: black;
    font-family: "Rubik", sans-serif;
    font-weight: 100;
    font-size: 20px;
    padding: 100px 20px;
    align-items: center;
    display: flex;
    justify-content: center;
    word-break: normal;
    text-align: center;
}

.getStartedBMain{
    color: black;
    background-color: rgb(155, 201, 255);
    align-items: center;
    display: flex;
    gap: 10px;
    border: none;
    cursor: pointer;
    padding: 30px 10px;
    border-radius: 7px;
    font-family: "Inter", sans-serif;
    font-weight: 800;
    font-size: 40px;
    margin: 0 auto;
    position: relative; top: -75px;
    transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
}

.getStartedBMain:hover{
    background-color: rgb(120, 180, 255);
    text-shadow: 0.7px 0 0 currentColor;
}

.getStartedBMain:hover img {
    filter: drop-shadow(0.7px 0 0 currentColor);
}

</style>

