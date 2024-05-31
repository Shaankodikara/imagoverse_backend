import fs from "fs";
import client from "../utils/monster_api.cjs";
import { uploadImage } from "../utils/cloudinaryUtil.js";

export const generateImage = async (req, res) => {
  let { prompt } = req.body;
  prompt +=
    "The above is the prompt provided by the user.But please generate images only related to clothing or garment or textile by considering the user input. Our company is a clothing related business";

  const url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.GET_IMG_API_KEY}`,
    },
    body: JSON.stringify({ 
      model: 'stable-diffusion-xl-v1-0',
      negative_prompt: 'Disfigured, cartoon, blurry, nude, violent',
      negative_prompt_2: 'Disfigured, cartoon, blurry, nude, violent',
      width: 768,
      height: 768,
      steps: 25,
      guidance: 9,
      prompt: prompt,
    
    }),

  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return res.json({ status: "ok", api_data: data });
  } catch (error) {
    return res.json({ status: "fail", message: error.message });
  }
};

export const editImageUsingImage = async (req, res) => {
  let { prompt } = req.body;
  prompt +=
    "The above is the prompt provided by the user.But please generate images only related to clothing or garment or textile by considering the user input. Our company is a clothing related business";

  const imageStream = fs.readFileSync(req.file.path);

  const uploadResult = await uploadImage(imageStream, "temp_img");

  console.log(uploadResult);

  const model = "pix2pix";
  const input = {
    prompt: prompt,
    init_image_url: uploadResult.secure_url,
    negprompt: 'deformed, bad anatomy, disfigured, poorly drawn face',
    steps: 30,
    guidance_scale: 12.5,
    image_guidance_scale: 1.5,
    seed: 2414,
  };

  client
    .get_response(model, input)
    .then((result) => {
      console.log("Generated Data:", result);

      client
        .wait_and_get_result(result.process_id)
        .then((result) => {
          // Handle the generated content result
          fs.unlinkSync(req.file.path);
          return res.json({ status: "ok", api_data: result });
        })
        .catch((error) => {
          fs.unlinkSync(req.file.path);
          return res.json({ status: "fail", message: error.message });
        });
    })
    .catch((error) => {
      fs.unlinkSync(req.file.path);
      return res.json({ status: "fail", message: error.message });
    });
};

export const detailEditImageUsingImage = async (req, res) => {
  try {
    let { prompt } = req.body;
    prompt +=
      "The above is the prompt provided by the user.But please generate images only related to clothing or garment or textile by considering the user input. Our company is a clothing related business";

    const base64Image = fs.readFileSync(req.file.path, { encoding: "base64" });

    const url = "https://api.getimg.ai/v1/stable-diffusion-xl/image-to-image";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.GET_IMG_API_KEY}`,
      },
      body: JSON.stringify({ 
        prompt: prompt, image: base64Image,
        model: 'stable-diffusion-xl-v1-0', //'realistic-vision-v5-1', //'stable-diffusion-v1-5' , 
        negative_prompt: 'Disfigured, cartoon, blurry',
        strength: 0.36,                    
        steps: 32,                         
        guidance: 12,                      
        scheduler: 'euler'                 
        
      
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    // Delete the temporary image file
    fs.unlinkSync(req.file.path);

    return res.json({ status: "ok", api_data: data });
  } catch (error) {
    // Delete the temporary image file
    fs.unlinkSync(req.file.path);
    return res.json({ status: "fail", message: error.message });
  }
};


