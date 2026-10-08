import { GoogleGenAI } from "@google/genai";
import { AspectRatio, UploadedImage, FashionModelType, FashionAgeGroup, FashionStyle, MockupCategory } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extractImagesFromResponse(response: any): string[] {
    const images: string[] = [];
    for (const candidate of response.candidates || []) {
        for (const candidatePart of candidate.content?.parts || []) {
            if (candidatePart.inlineData) {
                images.push(`data:image/png;base64,${candidatePart.inlineData.data}`);
            }
        }
    }
    return images;
}

// --- New Feature: Generate Idol Image (Celebrity Compositing) ---
export const generateIdolImage = async (
  userImage: UploadedImage,
  idolImage: UploadedImage,
  ratio: AspectRatio
): Promise<string[]> => {
  const userPart = await fileToGenerativePart(userImage.file);
  const idolPart = await fileToGenerativePart(idolImage.file);
  
  // 4 Variations of Poses with emphasis on Natural Interaction
  const variations = [
    {
      style: "Standard Fan Photo (Side-by-Side)",
      instruction: "A classic, polite meet-and-greet photo. Person A and Person B standing shoulder-to-shoulder, smiling at the camera. Realistic indoor event lighting."
    },
    {
      style: "Close-up Selfie",
      instruction: "A handheld smartphone selfie taken by Person A. Heads are close together. Angle is slightly high. Authentic phone camera aesthetic with natural lens distortion."
    },
    {
      style: "Candid Moment (Talking/Laughing)",
      instruction: "A paparazzi-style shot or candid moment where Person A and Person B are looking at each other, laughing or talking. They are NOT looking at the camera. Very natural and spontaneous."
    },
    {
      style: "High-End Studio / Red Carpet",
      instruction: "A polished, professional photo taken by a photographer. Sharp focus, perfect 3-point lighting, bokeh background. Both subjects looking confident and elegant."
    }
  ];

  const generateVariation = async (variation: { style: string, instruction: string }) => {
    const systemPrompt = `
      Role: Senior VFX Compositor & High-End Retoucher.
      Task: Create a seamless, photorealistic composite of two specific people.

      INPUTS:
      - Image 1: Person A (User). Preserve identity 100%.
      - Image 2: Person B (Idol). Preserve identity 100%.

      SCENE STYLE: ${variation.style}
      INSTRUCTION: ${variation.instruction}

      CRITICAL RULES (ZERO TOLERANCE FOR FAILURE):
      1. **IDENTITY LOCK (MOST IMPORTANT)**:
         - The face of Person A MUST look exactly like Image 1.
         - The face of Person B MUST look exactly like Image 2.
         - DO NOT morph, blend, or "beautify" their features into generic AI faces. Keep unique facial structures, moles, and expressions.

      2. **HYPER-REALISTIC COMPOSITING**:
         - **Lighting Match**: You must virtually "relight" Person A to match the light source, direction, and color temperature of Person B's environment (or the new scene).
         - **Contact Shadows**: If they are touching, there MUST be shadows cast between them. No floating heads/bodies.
         - **Texture Matching**: Match the skin texture, camera noise, and resolution. Do not paste a low-res face on a high-res body or vice versa.

      3. **NO "STICKER EFFECT"**:
         - Blend the edges of the subjects softly into the background.
         - Apply atmospheric depth (slight blur on background elements).

      Output: A raw, authentic-looking photograph.
    `;

    try {
       const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [userPart, idolPart, { text: systemPrompt }],
          },
          config: {
            imageConfig: { aspectRatio: ratio },
          },
        });
        const images = extractImagesFromResponse(response);
        return images[0]; // Return single image per variation
    } catch (e) {
      console.error(`Error generating variation ${variation.style}:`, e);
      return null;
    }
  };

  try {
    // Generate all 4 variations in parallel
    const results = await Promise.all(variations.map(v => generateVariation(v)));
    const validImages = results.filter((img): img is string => img !== null);

    if (validImages.length === 0) throw new Error("No image generated");

    return validImages;
  } catch (error) {
    console.error("Idol generation error:", error);
    throw error;
  }
};


// --- Video Generation for Photo Bareng Idola ---
export const startIdolVideoGeneration = async (
  imageUrl: string,
  ratio: AspectRatio
): Promise<string> => {
  const matches = imageUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Format gambar hasil tidak valid.");
  const mimeType = matches[1];
  const base64Data = matches[2];

  const veoRatio = ratio === AspectRatio.WIDE ? '16:9' : '9:16';

  const prompt = "A gentle, hyper-realistic cinematic video of the two subjects in the photo. Natural, subtle movements: blinking, breathing softly, nodding or tilting head slightly, and smiling pleasantly at each other. The camera is steady, maintaining the photo studio or cinematic event quality and preserving perfect facial attributes of both people.";

  try {
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: veoRatio
      }
    });

    if (!operation || !operation.name) {
      throw new Error("Tidak menerima respon nama operasi dari AI!");
    }

    return operation.name;
  } catch (error) {
    console.error("Error starting Veo generation:", error);
    throw error;
  }
};

export const pollIdolVideoStatus = async (
  operationName: string
): Promise<{ done: boolean; error?: string; videoUri?: string }> => {
  try {
    const updated: any = await ai.operations.getVideosOperation({
      operation: { name: operationName } as any
    });

    if (updated.error) {
      return { done: true, error: updated.error.message || "Gagal memproses video." };
    }

    if (updated.done) {
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return { done: true, error: "Video berhasil diproses tapi tidak menemukan URL video." };
      }
      return { done: true, videoUri: uri };
    }

    return { done: false };
  } catch (error: any) {
    console.error("Error polling Veo operation:", error);
    return { done: true, error: error.message || "Gagal melakukan polling status video." };
  }
};

export const downloadVideoFile = async (uri: string): Promise<string> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
  try {
    const response = await fetch(uri, {
      headers: {
        'x-goog-api-key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Unduhan gagal dengan status: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error downloading video bytes:", error);
    throw error;
  }
};


// --- Existing Feature: Generate Wedding Image (Multiple Subject Compositing) ---
export const generateWeddingImage = async (
  groomImage: UploadedImage,
  brideImage: UploadedImage,
  refImage: UploadedImage | null,
  eventType: string,
  shotType: string,
  weddingStyle: string,
  location: string,
  watermark: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const groomPart = await fileToGenerativePart(groomImage.file);
  const bridePart = await fileToGenerativePart(brideImage.file);
  const parts: any[] = [groomPart, bridePart];
  
  if (refImage) {
    const refPart = await fileToGenerativePart(refImage.file);
    parts.push(refPart);
  }

  const systemPrompt = `
    Role: World-Class Wedding Photographer & Digital Artist.
    Task: Create a masterpiece ${eventType} photograph featuring the Groom (Image 1) and the Bride (Image 2).
    
    PHOTOGRAPHY SPECS:
    - Shot Type: ${shotType}
    - Style: ${weddingStyle}
    - Location: ${location}
    ${watermark ? `- Mandatory Watermark Text: "${watermark}" (place elegantly at bottom corner)` : ""}
    
    CRITICAL INSTRUCTIONS:
    1. **DUAL IDENTITY PRESERVATION**: This is the most important rule. The Groom in the final image MUST look exactly like the person in Image 1. The Bride in the final image MUST look exactly like the person in Image 2. Preserve facial structures, features, and expressions.
    2. **ROMANTIC INTERACTION**: The couple should be posed naturally and romantically together (holding hands, looking at each other, or walking together) matching the ${eventType} context.
    3. **WARDROBE**: Generate appropriate premium wedding/pre-wedding attire that matches the ${weddingStyle} and ${location}.
    4. **LIGHTING & ATMOSPHERE**: Use professional cinematic lighting. If ${refImage ? "Image 3 is provided" : "the style is " + weddingStyle}, use it as a reference for the mood and color grading.
    5. **QUALITY**: Output a high-resolution, 8k photorealistic commercial photoshoot quality.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [...parts, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Wedding generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate POV Hand Image (Hand Interaction) ---
export const generatePOVHandImage = async (
  productImage: UploadedImage,
  productDescription: string,
  scenePrompt: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const productPart = await fileToGenerativePart(productImage.file);
  
  const systemPrompt = `
    Role: Professional Lifestyle Photographer & Hand Model Specialist.
    Task: Create a high-end commercial POV (Point of View) photo where a realistic human hand is holding or using the product from Image 1.
    
    PRODUCT DETAILS: "${productDescription}"
    SCENE/POV CONTEXT: "${scenePrompt}"
    
    CRITICAL INSTRUCTIONS:
    1. **HAND INTERACTION**: A real human hand (male or female as appropriate for the context) must be clearly holding the product. The grip must look natural, showing correct finger placement and contact shadows.
    2. **PRODUCT AUTHENTICITY**: The product in the hand MUST look identical to Image 1 (labels, colors, shape). Do not hallucinate a different brand or design.
    3. **PERSPECTIVE**: The perspective should be POV (looking from the eyes of the person holding the product).
    4. **AESTHETICS**: Use professional photography techniques: shallow depth of field (bokeh background), cinematic lighting, and 8k high resolution.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [productPart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("POV Hand generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Pose Image (Character Consistency & Rigging) ---
export const generatePoseImage = async (
  sourceImage: UploadedImage,
  poseType: string,
  customPose: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const sourcePart = await fileToGenerativePart(sourceImage.file);
  
  const poseInstruction = poseType === 'Custom' ? customPose : `in a ${poseType} pose`;

  const systemPrompt = `
    Role: Professional Digital Character Artist & Pose Specialist.
    Task: Change the pose of the person in Image 1 to: ${poseInstruction}.
    
    CRITICAL INSTRUCTIONS:
    1. **IDENTITY PRESERVATION**: The person's face, features, hair, and clothing from Image 1 MUST be perfectly preserved. They should look like the exact same individual.
    2. **ANATOMICAL ACCURACY**: The new pose must look natural and anatomically correct. Ensure correct proportions and limb placement.
    3. **LIGHTING & SHADOWS**: Adjust the lighting on the subject to match the new posture while maintaining the background style from Image 1.
    4. **QUALITY**: Output a high-resolution, 8k photorealistic commercial quality image.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [sourcePart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Pose generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Realistic Model (Text-to-Image) ---
export const generateModelImage = async (
  description: string,
  bgType: 'flat' | 'environment',
  ratio: AspectRatio
): Promise<string[]> => {
  const bgInstruction = bgType === 'flat' 
    ? "The model should be in a professional photo studio with a clean, flat, neutral-colored background." 
    : "The model should be in a realistic, high-end lifestyle environment or natural outdoor setting matching the description.";

  const systemPrompt = `
    Role: Professional Fashion Photographer & Casting Director.
    Task: Generate a high-quality, photorealistic image of a human model based on the following description.
    
    DESCRIPTION: "${description}"
    ENVIRONMENT: ${bgInstruction}
    
    CRITICAL INSTRUCTIONS:
    1. **REALISM**: The person must look like a real human being, not 3D rendered or artificial. Pay extreme attention to skin texture, eyes, and hair.
    2. **ANATOMY**: Ensure perfect anatomical accuracy (correct number of fingers, natural limb proportions).
    3. **QUALITY**: Output a high-resolution, 8k professional commercial photography quality.
    4. **DIVERSITY**: Respect the specific traits provided in the description (age, ethnicity, gender, etc.).
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Model generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Banner Image (Graphic Design & Typography) ---
export const generateBannerImage = async (
  productImage: UploadedImage,
  headlineText: string,
  styleDesc: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const productPart = await fileToGenerativePart(productImage.file);
  
  const systemPrompt = `
    Role: Professional Ad Agency Graphic Designer.
    Task: Create a high-converting, premium commercial banner for the product in Image 1.
    
    TEXT TO INCLUDE: "${headlineText}"
    DESIGN STYLE: ${styleDesc}
    
    CRITICAL INSTRUCTIONS:
    1. **TYPOGRAPHY**: Place the text "${headlineText}" clearly and aesthetically on the banner. Use modern, professional fonts that match the ${styleDesc} vibe. The text must be highly readable and look like a real professional design.
    2. **PRODUCT FOCUS**: The product from Image 1 must remain the hero. Integrate it naturally into the layout.
    3. **LAYOUT**: Arrange elements (product, text, shapes, backgrounds) using professional design principles (rule of thirds, balance, hierarchy).
    4. **AESTHETICS**: Professional color grading, high-resolution 8k, commercial ad quality.
    5. **NO HALLUCINATIONS**: Do not change the product's identity or labels.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [productPart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Banner generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Mockup Image (Surface Mapping) ---
export const generateMockupImage = async (
  designImage: UploadedImage,
  category: MockupCategory,
  item: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const designPart = await fileToGenerativePart(designImage.file);
  
  const systemPrompt = `
    Role: Professional Product Designer & Mockup Specialist.
    Task: Create a highly realistic commercial mockup by applying the design in Image 1 onto the following item: ${item} (Category: ${category}).
    
    CRITICAL INSTRUCTIONS:
    1. **DESIGN APPLICATION**: Map the design from Image 1 onto the surface of the ${item} accurately. Follow the object's curves, textures, and physical form. The design should look like it is high-quality printed, engraved, or embossed on the actual object.
    2. **REALISM**: The object must look 3D and integrated into a professional studio environment with correct contact shadows, highlights, and reflections.
    3. **QUALITY**: Output a high-resolution, 8k photorealistic commercial photoshoot quality.
    4. **COMPOSITION**: The mockup item should be the primary hero focus in the center of the image.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [designPart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Mockup generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Fashion Image (Editorial & E-commerce) ---
export const generateFashionImage = async (
  productImage: UploadedImage,
  logoImage: UploadedImage | null,
  modelType: FashionModelType,
  genderContext: string,
  ageGroup: FashionAgeGroup,
  customAge: string,
  visualStyle: FashionStyle,
  customStyle: string,
  ratio: AspectRatio,
  userPrompt: string
): Promise<string[]> => {
  const productPart = await fileToGenerativePart(productImage.file);
  const parts: any[] = [productPart];
  
  if (logoImage) {
    const logoPart = await fileToGenerativePart(logoImage.file);
    parts.push(logoPart);
  }

  let modelInstruction = "";
  if (modelType === 'human') {
    const ageInfo = ageGroup === 'custom' ? customAge : ageGroup;
    modelInstruction = `A realistic human ${genderContext} model, ${ageInfo} age group, wearing the product perfectly.`;
  } else if (modelType === 'mannequin') {
    modelInstruction = `A professional ${genderContext} fashion mannequin wearing the product in a studio setting.`;
  } else {
    modelInstruction = `Flat lay or ghost mannequin photography of the product. No visible model. Environment: ${genderContext}.`;
  }

  const styleInfo = visualStyle === 'custom' ? customStyle : visualStyle;
  
  const systemPrompt = `
    Role: Professional Fashion Photographer & Editorial Stylist.
    Task: Create a high-end fashion editorial or e-commerce photo using the product in Image 1.
    
    MODEL/SUBJECT: ${modelInstruction}
    STYLE/VIBE: ${styleInfo} fashion photography style.
    ADDITIONAL INSTRUCTIONS: "${userPrompt}"
    
    CRITICAL INSTRUCTIONS:
    1. **PRODUCT AUTHENTICITY**: The fashion item from Image 1 MUST be preserved accurately in shape, color, fabric texture, and details.
    2. **STYLING**: Integrate the item into a complete, fashionable outfit that matches the ${styleInfo} vibe.
    3. **LOGO**: ${logoImage ? "Subtly and realistically place the brand logo from Image 2 on the product or as a watermark in the scene." : "Do not add any random logos."}
    4. **PHOTOGRAPHY QUALITY**: Professional lighting, 8k resolution, high-end fashion magazine quality.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [...parts, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Fashion generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Product + Model (Advanced Compositing) ---
export const generateProductModelImage = async (
  modelImage: UploadedImage,
  productImage: UploadedImage,
  ratio: AspectRatio,
  userPrompt: string
): Promise<string[]> => {
  const modelPart = await fileToGenerativePart(modelImage.file);
  const productPart = await fileToGenerativePart(productImage.file);
  
  const systemPrompt = `
    Role: Professional AI Photo Editor & Compositor.
    Task: Seamlessly integrate the Product (Image 2) into the hands or scene of the Model (Image 1).
    
    ADDITIONAL INSTRUCTIONS: "${userPrompt}"
    
    CRITICAL INSTRUCTIONS:
    1. **IDENTITY PRESERVATION**: Keep the model's face (Image 1) and the product's design/labels (Image 2) identical to the originals.
    2. **REALISTIC INTERACTION**: The model must be HOLDING or USING the product naturally. Focus on correct finger placement and contact points.
    3. **UNIFIED LIGHTING**: Match the lighting and shadows of the product to the model's environment. Add contact shadows where the product meets the model's body.
    4. **COMMERCIAL QUALITY**: The final output must be high-resolution 8k, looking like a professional commercial photoshoot.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [modelPart, productPart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Product+Model generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Product Image (Commercial Photography) ---
export const generateProductImage = async (
  image: UploadedImage,
  lighting: string,
  ambience: string,
  crowdType: string,
  ratio: AspectRatio,
  userPrompt: string
): Promise<string[]> => {
  const imagePart = await fileToGenerativePart(image.file);
  
  const lightingDesc = lighting === 'light' ? 'Bright, soft studio lighting, high-key' : 'Dramatic shadows, moody low-key lighting, professional cinematic lighting';
  const backgroundDesc = ambience === 'clean' 
    ? 'Clean, minimalist professional studio background, solid neutral color' 
    : `Authentic lifestyle environment, ${crowdType} setting, aesthetic and organized background`;

  const systemPrompt = `
    Role: Professional Commercial Product Photographer.
    Task: Create a high-quality advertising photo for the product in Image 1.
    
    ENVIRONMENT: ${backgroundDesc}
    LIGHTING: ${lightingDesc}
    ADDITIONAL DETAILS: "${userPrompt}"
    
    CRITICAL INSTRUCTIONS:
    1. **PRODUCT PRESERVATION**: The product from Image 1 MUST be the hero of the image. Preserve its exact labels, text, colors, and physical form.
    2. **Realism**: The product must look physically integrated into the scene with correct contact shadows and reflections.
    3. **Aesthetics**: High-resolution, 8k, bokeh effect on background, commercial-grade quality.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [imagePart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Product generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Restored Image (Restoration & Colorization) ---
export const generateRestoredImage = async (
  image: UploadedImage,
  ratio: AspectRatio
): Promise<string[]> => {
  const imagePart = await fileToGenerativePart(image.file);
  
  const systemPrompt = `
    Role: Professional Photo Restoration & Colorization Expert.
    Task: Restore the provided old/damaged photo (Image 1).
    
    CRITICAL INSTRUCTIONS:
    1. **Repair**: Remove scratches, dust, stains, and physical damage.
    2. **Enhance**: Sharpen blurry details and increase clarity significantly.
    3. **Colorize**: If the photo is black and white, colorize it naturally with realistic skin tones, clothing, and environmental colors. If it's already in color, enhance and vibrant the colors.
    4. **Quality**: Output a high-resolution, professional-grade 8k photorealistic restoration.
    5. **Identity**: Preserve the original facial features and expressions of any people in the photo.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [imagePart, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Restoration error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Merged Image (Fusion) ---
export const generateMergedImage = async (
  images: UploadedImage[],
  userPrompt: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const imageParts = await Promise.all(images.map(img => fileToGenerativePart(img.file)));
  
  const systemPrompt = `
    Role: Professional Digital Compositor & AI Artist.
    Task: Merge and composite the provided images into a single, cohesive, and photorealistic scene.
    
    User Instructions: "${userPrompt}"
    
    CRITICAL RULES:
    1. **Seamless Integration**: Blend all subjects from the input images naturally into the new environment or composition.
    2. **Consistent Lighting**: Apply uniform lighting, shadows, and color grading across all merged elements to ensure they look like they belong in the same photo.
    3. **Preserve Identity**: Keep the main subjects/objects from the input images recognizable and detailed.
    4. **Quality**: Output a high-resolution, professional-grade commercial image.
  `;

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [...imageParts, { text: systemPrompt }],
        },
        config: {
          imageConfig: { aspectRatio: ratio }
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Merge generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Expanded Image (Outpainting) ---
export const generateExpandedImage = async (canvasBase64: string): Promise<string[]> => {
  const imagePart = {
    inlineData: {
      data: canvasBase64.split(',')[1],
      mimeType: 'image/png',
    },
  };

  const prompt = "Outpaint and expand this image to fill the entire frame perfectly. Generatively fill the empty or transparent areas around the original content to create a seamless, photorealistic, and natural continuation of the scene. Maintain the same lighting, textures, and artistic style of the original image.";

  try {
    const promises = Array.from({ length: 4 }).map(() => 
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [imagePart, { text: prompt }],
        }
      })
    );

    const responses = await Promise.all(promises);
    const allImages = responses.flatMap(response => extractImagesFromResponse(response));

    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Expand generation error:", error);
    throw error;
  }
};

// --- Existing Feature: Generate Try On Image ---
export const generateTryOnImage = async (
  productImage: UploadedImage,
  modelImage: UploadedImage,
  description: string,
  mode: 'wear' | 'use' | 'hold',
  ratio: AspectRatio
): Promise<string[]> => {
  const productPart = await fileToGenerativePart(productImage.file);
  const modelPart = await fileToGenerativePart(modelImage.file);
  
  let interactionPrompt = "";
  if (mode === 'wear') {
    interactionPrompt = "The model should be WEARING the product (if it is clothing or accessory).";
  } else if (mode === 'use') {
    interactionPrompt = "The model should be USING the product naturally (e.g., applying cosmetic, drinking from bottle, typing on laptop).";
  } else {
    interactionPrompt = "The model should be HOLDING the product clearly in their hand.";
  }

  const fullPrompt = `
    Role: Professional Commercial Photographer.
    Task: Composite the product (Image 1) into the model scene (Image 2) realistically.
    
    INPUTS:
    - Image 1: The Product. Description: ${description}.
    - Image 2: The Model.
    
    INTERACTION MODE: ${interactionPrompt}
    
    CRITICAL INSTRUCTIONS:
    1. **Product Identity**: The product in the final image MUST look exactly like Image 1. Preserve text, logo, color, and packaging details.
    2. **Model Identity**: The model in the final image MUST look exactly like Image 2.
    3. **Realism**: The interaction must look physically accurate. Hands, lighting, and shadows must be correct.
    4. **Composition**: Focus on the product and the model's interaction.
    
    Output a high-quality, 8k photorealistic image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [productPart, modelPart, { text: fullPrompt }],
      },
      config: {
        imageConfig: { aspectRatio: ratio }
      }
    });

    return extractImagesFromResponse(response);
  } catch (error) {
    console.error("Try On generation error:", error);
    throw error;
  }
};

export const generateEditedImage = async (base64Image: string, base64Mask: string, prompt: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/png',
        }
    };
    const maskPart = {
        inlineData: {
            data: base64Mask.split(',')[1],
            mimeType: 'image/png',
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                maskPart,
                { text: `Edit the area of the image covered by the mask. Instruction: ${prompt}` }
            ]
        }
    });

    const images = extractImagesFromResponse(response);
    return images[0];
};

export const analyzeProductForBanner = async (image: UploadedImage): Promise<{ headline: string, style: string }> => {
    const imagePart = await fileToGenerativePart(image.file);
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                imagePart,
                { text: "Analyze this product image. Generate a catchy headline for a banner ad (max 10 words) and suggest a visual design style (color palette, vibe) for the banner. Return JSON with keys: 'headline' and 'style'." }
            ]
        },
        config: {
            responseMimeType: "application/json"
        }
    });
    
    const text = response.text;
    if (!text) return { headline: "", style: "" };
    try {
        return JSON.parse(text);
    } catch {
        return { headline: "", style: "" };
    }
};

export const analyzeProductDescription = async (image: UploadedImage): Promise<string> => {
    const imagePart = await fileToGenerativePart(image.file);
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                imagePart,
                { text: "Describe this product in detail (color, material, shape, key features) for a text-to-image prompt." }
            ]
        }
    });
    return response.text || "";
};

export const analyzeProductFeatures = async (
  productImage: UploadedImage
): Promise<string> => {
  const productPart = await fileToGenerativePart(productImage.file);
  const prompt = `
    Analyze this product image carefully.
    
    Identify:
    1. Product Name (look for text/logo on packaging if visible, otherwise deduce from shape).
    2. Key Features (shape, material, function).
    3. Color (dominant color of product/packaging).
    4. Visual Style (modern, retro, minimalist, luxury, etc.).
    
    Output a concise summary paragraph describing these details in INDONESIAN (Bahasa Indonesia).
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [productPart, { text: prompt }] }
    });
    return response.text || "Produk tidak teridentifikasi.";
  } catch (e) { return "Gagal menganalisa produk."; }
};

export const generateUGCModel = async (
  productImage: UploadedImage,
  userPrompt: string,
  ratio: AspectRatio
): Promise<string[]> => {
  const productPart = await fileToGenerativePart(productImage.file);
  
  const styles = [
      "Style: Commercial Lifestyle. Lighting: Bright & Airy. Focus: Clear Product Usage.",
      "Style: Close-Up Portrait. Lighting: Soft Studio. Focus: Model Interaction.",
      "Style: Authentic Candid. Lighting: Natural/Sunlight. Focus: Lifestyle Context.",
      "Style: High-End Editorial. Lighting: Dramatic/Moody. Focus: Product Details."
  ];

  const promises = styles.map(async (style) => {
    const fullPrompt = `
        Role: Professional Commercial Photographer.
        Task: Create a photorealistic lifestyle image using Image 1 (The Product).
        
        INPUTS:
        - Image 1: The Product (MUST BE PRESERVED).
        
        USER INSTRUCTION: "${userPrompt}"
        ${style}
        
        CRITICAL INSTRUCTIONS (STRICT):
        1. **MANDATORY USAGE**: The model generated MUST be **WEARING** the product (if it is clothing, shoes, or accessory) or **HOLDING/USING** it (if it is an object/device). Do not place the product in the background.
        2. **PRODUCT PRESERVATION**: The product in the final image must look IDENTICAL to Image 1 (Logo, Text, Shape, Color). Do not hallucinate a different product.
        3. **REALISM**: Ensure the product blends naturally with the model's hands/body. Correct shadows and physics.
        
        Output: Photorealistic 8k image.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [productPart, { text: fullPrompt }] },
            config: { imageConfig: { aspectRatio: ratio } }
        });
        const imgs = extractImagesFromResponse(response);
        return imgs[0];
    } catch (e) {
        console.error("Error generating variation:", e);
        return null;
    }
  });

  const results = await Promise.all(promises);
  const validResults = results.filter((r): r is string => r !== null);
  
  if (validResults.length === 0) throw new Error("Failed to generate UGC images.");
  return validResults;
};

export const generateUGCPose = async (
  sourceImage: UploadedImage,
  poseType: string,
  category: string,
  bgType: string,
  customBgText: string,
  customBgImage: UploadedImage | null
): Promise<string[]> => {
  const sourcePart = await fileToGenerativePart(sourceImage.file);
  const parts: any[] = [sourcePart];
  
  let bgInstruction = "Neutral background.";
  if (bgType === 'custom') {
    if (customBgImage) {
      const bgPart = await fileToGenerativePart(customBgImage.file);
      parts.push(bgPart);
      bgInstruction = "Use Image 2 as background reference.";
    } else {
      bgInstruction = `Background: ${customBgText}`;
    }
  }

  let variations: string[] = [];

  if (category === 'head') {
      variations = [
          "close-up portrait, facing forward.",
          "three-quarter profile view, slightly turned away from the camera.",
          "very close up photo from the side.",
          "top shot, showing off the product."
      ];
  } else if (category === 'body') {
      variations = [
          "a with the camera angle taken from a high angle, directly overhead, with a 45 degree angle of view.",
          "very close portrait.",
          "forward walking pose, capturing natural movement.",
          "a three-quarter profile view with your head turned towards the camera."
      ];
  } else if (category === 'hand') {
      variations = [
          "close-up showing product details.",
          "aerial shot focusing on the hand to highlight the product, with the hand resting on a neutral surface.",
          "a pose where the hand holds a small product close to the head, showing it off to the viewer.",
          "a graceful hand gesture, using the product."
      ];
  } else if (category === 'legs') {
      variations = [
          "a shot focused on the legs and feet while walking.",
          "sitting on a bench with legs crossed, focusing on the feet and shoes.",
          "a low-angle shot showing a standing pose, emphasizing footwear.",
          "a dynamic pose such as stepping onto a sidewalk, with a close-up on the shoes."
      ];
  } else {
      variations = [
        `Pose variation 1: ${category} - ${poseType}`,
        `Pose variation 2: ${category} - ${poseType} (Different Angle)`,
        `Pose variation 3: ${category} - ${poseType} (Close up)`,
        `Pose variation 4: ${category} - ${poseType} (Dynamic)`
      ];
  }

  const promises = variations.map(async (v) => {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [...parts, { text: `Generate pose: ${v}. ${bgInstruction}. Preserve identity of Image 1 subject.` }] }
        });
        return extractImagesFromResponse(response)[0];
      } catch (e) { return null; }
  });

  const results = await Promise.all(promises);
  return results.filter((r): r is string => r !== null);
};

export const generateCustomUGCPose = async (
  sourceImage: UploadedImage,
  userPrompt: string
): Promise<string[]> => {
  const sourcePart = await fileToGenerativePart(sourceImage.file);
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [sourcePart, { text: `Change pose of Image 1 subject: ${userPrompt}. Preserve identity.` }] }
  });
  return extractImagesFromResponse(response);
};

export const generateImageToVideoPrompt = async (
  dataUrl: string
): Promise<string> => {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid image data");
    const mimeType = matches[1];
    const data = matches[2];

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType, data } },
                { text: "Analyze this image details (subject, lighting, style). Create a high-quality prompt for AI Video Generator (like Veo or Sora) to animate this image. Focus on cinematic movement, camera angle, and atmosphere. Return ONLY the prompt text." }
            ]
        }
    });

    return response.text || "Cinematic shot of the subject, slow motion camera pan.";
};

// --- Remove Background Feature ---
export const generateRemoveBgImage = async (
  image: UploadedImage
): Promise<string[]> => {
  const imagePart = await fileToGenerativePart(image.file);
  const prompt = `
    Role: Professional Photo Retoucher & Background Isolation Specialist.
    Task: Precisely cut out and isolate the main subject from Image 1.
    Remove the background completely and place the subject on a clean studio white backdrop, keeping razor-sharp subject edges, hair details, and true lighting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
    });

    const allImages = extractImagesFromResponse(response);
    if (allImages.length === 0) throw new Error("No image generated.");
    return allImages;
  } catch (error) {
    console.error("Remove background error:", error);
    throw error;
  }
};

// --- Studio Chat Assistant Feature ---
export const sendChatMessage = async (
  messageHistory: { role: 'user' | 'assistant'; content: string }[],
  latestPrompt: string
): Promise<string> => {
  try {
    const formattedContents = [
      ...messageHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: latestPrompt }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: "Anda adalah asisten kreatif dan teknis untuk My Studio AI. Berikan saran prompt AI, ide fotografi produk e-commerce, pemilihan model, teknik pose dan pencahayaan, serta konsultasi branding dalam Bahasa Indonesia yang ramah, solutif, dan profesional."
      }
    });

    return response.text || "Terima kasih atas pertanyaannya. Ada yang bisa saya bantu lagi seputar desain atau editing foto Anda?";
  } catch (error: any) {
    console.error("Chat error:", error);
    throw new Error(error?.message || "Gagal memproses pesan chat.");
  }
};