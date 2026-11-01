(() => {
  const worlds = document.querySelector('.worlds');
  if (!worlds) return;
  const descriptions = {
    games: 'Block Bluup — a little room to play.',
    stories: 'Gece Dosyası — every story starts with a question.',
    tools: 'Kalradya Co-op — good games are better together.'
  };
  const buttons = [...worlds.querySelectorAll('[data-world]')];
  const description = worlds.querySelector('.world-description');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const world = button.dataset.world;
      if (!Object.hasOwn(descriptions, world)) return;
      worlds.dataset.activeWorld = world;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      description.textContent = descriptions[world];
    });
  });
})();
