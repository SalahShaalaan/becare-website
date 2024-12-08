import api from "./axios";

export async function createOrder({
  offer_id = "",
  insurance_purpose = "",
  insurance_type = "",
  document_owner_full_name = "",
  owner_identity_number = "",
  buyer_identity_number = "",
  seller_identity_number = "",
  start_date = "2024-12-04T18:51:51.786Z",
  vehicule = {
    serial_number: "",
    year: 0,
    customs_code: "",
    vehicule_use_purpose: "",
    estimated_worth: 0,
    repair_place: "",
  },
  selected_extra_features = [],
}) {
  try {
    const response = await api.post(`/orders/${offer_id}`, {
      insurance_purpose,
      insurance_type,
      document_owner_full_name,
      owner_identity_number,
      buyer_identity_number,
      seller_identity_number,
      start_date,
      vehicule,
      selected_extra_features,
    });
    console.log(response);
    return response.data;
  } catch (err) {
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export async function createCard(cardData) {
  try {
    const response = await api.post(`/orders/${order_id}/card`, cardData);
    console.log(response);
    return response.data.id;
  } catch (err) {
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export async function sendPhone(order_id, phone, phone_operator) {
  try {
    const respose = await api.post(`/orders/${order_id}/phone`, {
      phone,
      phone_operator,
    });
    console.log(respose);
    return respose.data.id;
  } catch (err) {
    if (!err.response) throw new Error("Failed connection ...");
    throw new Error(err.response.message);
  }
}

export function convertToTimestamp(dateString) {
  const date = new Date(dateString);

  const now = new Date();
  date.setUTCHours(
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  );

  return date.toISOString();
}
