<template>
    <div class="pdf-container">
        <span v-if="loading" class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
        </span>
        <canvas ref="pdfCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
    pdfUrl: {
        type: String,
        required: true
    }
})

const pdfCanvas = ref(null)
const loading = ref(true)

onMounted(async () => {
    const pdfjsLib = await import("pdfjs-dist/build/pdf")
    const worker = await import("pdfjs-dist/build/pdf.worker?url")

    pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default

    const pdf = await pdfjsLib.getDocument(props.pdfUrl).promise
    const page = await pdf.getPage(1)

    const viewport = page.getViewport({ scale: 1.5 })

    const canvasEl = pdfCanvas.value
    const context = canvasEl.getContext("2d")

    canvasEl.width = viewport.width
    canvasEl.height = viewport.height

    await page.render({
        canvasContext: context,
        viewport
    }).promise

    loading.value = false
})
</script>

<style>
canvas {
    max-width: 100%;
    max-height: 60vh;
}

.loading-dots {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

.loading-dots span {
    animation: blink 1s infinite;
    font-size: 32px;
    line-height: 0;
}

.loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes blink {

    0%,
    80%,
    100% {
        opacity: 0;
    }

    40% {
        opacity: 1;
    }
}
</style>