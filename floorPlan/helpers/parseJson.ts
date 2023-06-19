export const parseJson = (data: any, plug: any = {}) => {
  try {
    return JSON.parse(data) || plug;
  } catch (error) {
    return plug;
  }
};
