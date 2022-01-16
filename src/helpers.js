export const truncateAddress = (address) =>
  `${address.substring(0, 5).toUpperCase()}...${address
    .substring(38)
    .toUpperCase()}`;
