<!-- .src/components/ui/BaseTableList.vue -->


<script setup lang="ts">
  defineProps<{
    variant?: 'light' | 'yellow'
    layout?: 'fixed' | 'auto'
    marginStyle?: 'left_0.5vw' | 'bottom_0.5vw'
  }>()
</script>

<template>
  <table class="base_table_list"
         :class="[
             `style-${variant}`,
             `layout-${layout}`,
             `marginStyle-${marginStyle}`,
             ]">
    <slot name="colgroup"/>
    <thead>
      <tr>
        <slot name="thead_row"/>
      </tr>
    </thead>
    <tbody>
      <slot name="tbody_rows"/>
    </tbody>
  </table>
</template>

<style>
  .base_table_list{
    width: 100%;
    border-collapse: collapse;
    border-radius: var(--border-radius);
    font-weight: bold;
  }

  .base_table_list thead tr {
    min-height: var(--min-tr-height);
    font-size: var(--btn-font-size-md);
    background-color: var(--button-primary);
    text-align: center;
    text-transform: uppercase;
    position: sticky;
    top: 5vw;
    z-index: 10;
  }

  .base_table_list tbody tr {
    font-size: var(--btn-font-size-md);
    text-align: left;
    transition: 0.4s;
  }

  .base_table_list tbody tr:hover{
    background-color: var(--button-disabled);
  }

  .base_table_list img {
    opacity: 0.8;
  }

  .base_table_list tbody tr:hover img {
    opacity: 1;
  }

  .style-light {
    background-color: var(--bg);
    font-size: var(--btn-font-size-lg);
  }

  .style-yellow {
    background-color: var(--bg_header);
    box-shadow: var(--shadow-dark);
  }

  .layout-fixed {
    table-layout: fixed;
  }

  .marginStyle-left_0.5vw {
    margin-left: 0.5vw;
  }

  .marginStyle-bottom_0.5vw {
    margin-bottom: 3vw;
  }

</style>