<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    update: { timeInSeconds: number };
  }>();

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  $: dispatch('update', {
    timeInSeconds:
      Math.abs(hours || 0) * 3600 +
      Math.abs(minutes || 0) * 60 +
      Math.abs(seconds || 0),
  });
</script>

<div class="centerItems">
  <input
    placeholder="hh"
    type="number"
    min="0"
    class="timeInput"
    bind:value={hours}
  />
  :
  <input
    placeholder="mm"
    type="number"
    min="0"
    class="timeInput"
    bind:value={minutes}
  />
  :
  <input
    placeholder="ss"
    type="number"
    min="0"
    class="timeInput"
    bind:value={seconds}
  />
</div>

<style lang="scss">
  input {
    width: 2.5rem;
    border: none;
    outline: none;
    border-bottom: 2px solid #fff;
    background: transparent;
    color: #fff;
    font-weight: bold;

    &:focus {
      border-bottom-width: 2px;
    }
  }
</style>
