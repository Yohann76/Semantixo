<template>
  <ApplicationLayout>
    <template #default="{ selectedAnalysis, clearForm }">
      <InternalLinkAnalysis 
        :selected-analysis="selectedAnalysis"
        @clear-form="clearForm"
      />
    </template>
  </ApplicationLayout>
</template>

<script setup>
import ApplicationLayout from './ApplicationLayout.vue'
import InternalLinkAnalysis from './InternalLinkAnalysis.vue'
</script> 