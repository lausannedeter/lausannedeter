<script setup>
</script>

<template>
        <section class="about-page">
                <div class="section-container">
                        <div class="title-container">
                                <div class="title qui">
                                        <h2>Qui&thinsp;?</h2>
                                </div>
                                <div class="slider1"></div>
                        </div>
                        <div class="descr">
                                <p>Nous sommes <b>Lausanne Deter</b>, un collectif qui a pour but de visibiliser les
                                        différents
                                        événements
                                        militants de la région lausannoise.

                                        Nous souhaitons visibiliser toutes les luttes qui se placent à gauche du
                                        curseur
                                        politique
                                        et qui se battent
                                        contre toute forme d'oppression.
                                        <br><br>
                                        Nous ne prenons pas un parti pris idéologique spéficique et considérons que
                                        l’important
                                        est de miser
                                        sur une convergence des luttes, que visibiliser nos différents
                                        événements nous
                                        rendra
                                        plus fort, car
                                        c’est par le nombre que nous mettrons fin aux oppressions systémiques.
                                </p>
                        </div>
                </div>

                <div class="section-container">
                        <div class="title-container right">
                                <div class="title pq">
                                        <h2>Pourquoi&thinsp;?</h2>
                                </div>
                                <div class="slider2"></div>
                        </div>
                        <div class="descr">
                                <p>Nous avons constaté qu’il est parfois difficile d’être au courant des différents
                                        événements
                                        prenants
                                        place dans la région.

                                        Par cet agenda nous souhaitons mettre en avant ces événements afin de les
                                        rendre le
                                        plus accessible possible.
                                        <br><br>
                                        Nous pensons que rendre la lutte plus accessible, notamment par cet outil, nous
                                        permettra de faire
                                        grossir toujours plus notre camp et de peser davantage dans la bataille
                                        matérielle
                                        et
                                        idéologique en
                                        cours.
                                </p>
                        </div>
                </div>


                <div class="section-container">
                        <div class="title-container">
                                <div class="title com">
                                        <h2>Comment&thinsp;?</h2>
                                </div>
                                <div class="slider3"></div>
                        </div>
                        <div class="descr">
                                <p>Chaque mois les événements militants sont répértoriés sur ce site.
                                        Si vous êtes un collectif/lieu et souhaitez visibiliser un/des événements
                                        écrivez nous un mail à
                                        <b><a href="mailto:lausannedeter@proton.me">lausannedeter@proton.me</a></b> et
                                        retrouvez nous sur instagram à <b><a href="https://www.instagram.com/lsn.dtr/"
                                                        target="_blank">@lsn.dtr</a></b>.
                                        <br><br>
                                        Vous pouvez imprimer nos agendas pour les afficher dans vos différents lieux,
                                        afin
                                        de toujours avoir sous
                                        l’oeil le programme du mois :)
                                </p>
                        </div>
                </div>

                <nuxt-link to="/calendrier" class="button">Voir le calendrier</nuxt-link>
        </section>
</template>

<style scoped>
.about-page {
        padding: 50px 0;
        display: flex;
        flex-direction: column;
        gap: 50px;
}

.section-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
}

.title-container {
        display: flex;
        flex-direction: column;
        width: 60%;
        max-width: 400px;
}

.title {
        width: 100%;
        padding: 10px 20px;
        display: flex;
}

.title h2 {
        font-size: 30px;
}

.descr {
        margin: auto;
        font-size: 14px;
        padding: 0 24px;
}

.qui {
        background-color: #52BFEA;

        justify-content: right;
}

.slider1 {
        background-color: #90E0F3;

        width: calc(100% - 20px);
        height: 20px;
        justify-content: right;
}

.right {
        align-self: end;
        align-items: end;
}

.pq {
        background-color: #A8BA9A;
}

.slider2 {
        background-color: #ACE894;
        width: calc(100% - 20px);
        height: 20px;
}

.com {
        background-color: #FA41AE;
        justify-content: right;
}

.slider3 {
        background-color: #F4BFDB;

        width: calc(100% - 20px);
        height: 20px;
        justify-content: right;

}

.button {
        align-self: center;
}

/* TABLETTE */
@media (min-width: 750px) {

        .descr {
                padding: 0 72px;
        }
}

/* DESKTOP */
@media (min-width: 1200px) {

        .descr {
                padding: 0 144px;
        }
}
</style>