<template>
  <ApplicationLayout>
    <template #default="{ selectedAnalysis, clearForm }">
      <DomainAnalysis 
        :selected-analysis="selectedAnalysis"
        @clear-form="clearForm"
      />
    </template>
  </ApplicationLayout>
</template>

<script setup>
import ApplicationLayout from './ApplicationLayout.vue'
import DomainAnalysis from './DomainAnalysis.vue'
</script> 