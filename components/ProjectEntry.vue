<template>
  <div>
    <b-container fluid >
        <a name="flappy"></a>
        <b-row>

        </b-row>

    </b-container>
    <div class="container-fluid whiteRow pad20">
        <a name="flappy"></a>
        <div class="container pad20">
            <div class="borderProj">
                <div class="row">
                    <div class="col-lg-4 col-md-12">
                        <div class="projCenter">
                            <img src="/img/flappy.gif" class="projImg">
                        </div>
                    </div>
                    <div class="projText col-lg-8 col-md-12">
                        <h3 class="regTitle">FlappyBird | Java</h3>
                        <p class="subP italic">A OpenGL FlappyBird clone</p>
                        <p class="subText white extPad" id="desc">You gotta jump on the hype. This is a simple
                            FlappyBird clone written in Java using LWJGL. It uses OpenGL Shaders and Vertices for
                            rendering. Just like the mobile version this game is hard. But installation is easy. Just
                            clone the code and run maven on the pom file. Maven takes care of all dependency's. <br><br>
                            <a class="btn btn-secondary btn-lg w100" href="https://github.com/hegerdes/FlappyBird"
                                role="button">View Repository</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProjectEntry'
})
</script>