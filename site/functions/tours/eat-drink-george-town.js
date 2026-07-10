// 301 redirect: old Eat Drink George Town → Georgetown Night Food & Durian
export async function onRequest(context) {
  return Response.redirect('https://simplyenak.com/tours/georgetown-night-food-durian', 301);
}
