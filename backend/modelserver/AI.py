
import os
import numpy as np
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import pathlib

from collections import defaultdict
from io import StringIO
#from matplotlib import pyplot as plt
from PIL import Image, ImageDraw, ImageFont
from IPython.display import display

from tensorflow.keras import datasets, layers, models

from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util

import collections
import six
from six.moves import range
from six.moves import zip

'''
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus :
    try :
        for gpu in gpus :
            tf.config.experimental.set_memory_growth(gpu, True)

    except RuntimeError as e :
        print(e)
'''

# utils_ops.tf = tf.compat.v1
# tf.gfile = tf.io.gfile

# detection_model = tf.saved_model.load('object_detection/inference_graph/saved_model')

STANDARD_COLORS = [
    'AliceBlue', 'Chartreuse', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque',
    'BlanchedAlmond', 'BlueViolet', 'BurlyWood', 'CadetBlue', 'AntiqueWhite',
    'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan',
    'DarkCyan', 'DarkGoldenRod', 'DarkGrey', 'DarkKhaki', 'DarkOrange',
    'DarkOrchid', 'DarkSalmon', 'DarkSeaGreen', 'DarkTurquoise', 'DarkViolet',
    'DeepPink', 'DeepSkyBlue', 'DodgerBlue', 'FireBrick', 'FloralWhite',
    'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod',
    'Salmon', 'Tan', 'HoneyDew', 'HotPink', 'IndianRed', 'Ivory', 'Khaki',
    'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue',
    'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey',
    'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue',
    'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime',
    'LimeGreen', 'Linen', 'Magenta', 'MediumAquaMarine', 'MediumOrchid',
    'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen',
    'MediumTurquoise', 'MediumVioletRed', 'MintCream', 'MistyRose', 'Moccasin',
    'NavajoWhite', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed',
    'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed',
    'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple',
    'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Green', 'SandyBrown',
    'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue',
    'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'GreenYellow',
    'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White',
    'WhiteSmoke', 'Yellow', 'YellowGreen'
]

def getModel():
    utils_ops.tf = tf.compat.v1
    tf.gfile = tf.io.gfile

    detection_model = tf.saved_model.load('object_detection/inference_graph/saved_model')
    print("getModel() called")
    return detection_model


def draw_bounding_box_on_image_array(image,
                                     ymin,
                                     xmin,
                                     ymax,
                                     xmax,
                                     color='red',
                                     thickness=4,
                                     display_str_list=(),
                                     use_normalized_coordinates=True):
  
  image_pil = Image.fromarray(np.uint8(image)).convert('RGB')
  draw_bounding_box_on_image(image_pil, ymin, xmin, ymax, xmax, color,
                             thickness, display_str_list,
                             use_normalized_coordinates)
  np.copyto(image, np.array(image_pil))



def draw_bounding_box_on_image(image,
                               ymin,
                               xmin,
                               ymax,
                               xmax,
                               color='red',
                               thickness=4,
                               display_str_list=(),
                               use_normalized_coordinates=True):
  
  draw = ImageDraw.Draw(image)
  im_width, im_height = image.size
  if use_normalized_coordinates:
    (left, right, top, bottom) = (xmin * im_width, xmax * im_width,
                                  ymin * im_height, ymax * im_height)
  else:
    (left, right, top, bottom) = (xmin, xmax, ymin, ymax)
  if thickness > 0:
    draw.line([(left, top), (left, bottom), (right, bottom), (right, top),
               (left, top)],
              width=thickness,
              fill=color)
  try:
    font = ImageFont.truetype('arial.ttf', 24)
  except IOError:
    font = ImageFont.load_default()

  display_str_heights = [font.getsize(ds)[1] for ds in display_str_list]

  total_display_str_height = (1 + 2 * 0.05) * sum(display_str_heights)
  if top > total_display_str_height:
    text_bottom = top
  else:
    text_bottom = bottom + total_display_str_height

  for display_str in display_str_list[::-1]:
    text_width, text_height = font.getsize(display_str)
    margin = np.ceil(0.05 * text_height)
    draw.rectangle(
        [(left, text_bottom - text_height - 2 * margin), (left + text_width,
                                                          text_bottom)],
        fill=color)
    draw.text(
        (left + margin, text_bottom - text_height - margin),
        display_str,
        fill='black',
        font=font)
    text_bottom -= text_height - 2 * margin



def visualize_boxes_and_labels_on_image_array(
    image,
    boxes,
    classes,
    scores,
    category_index,
    instance_masks=None,
    instance_boundaries=None,
    keypoints=None,
    keypoint_scores=None,
    keypoint_edges=None,
    track_ids=None,
    use_normalized_coordinates=False,
    max_boxes_to_draw=3,
    min_score_thresh=0.3,
    agnostic_mode=False,
    line_thickness=4,
    mask_alpha=0.4,
    groundtruth_box_visualization_color='black',
    skip_boxes=False,
    skip_scores=False,
    skip_labels=False,
    skip_track_ids=False):
  global final_label
  box_to_display_str_map = collections.defaultdict(list)
  box_to_color_map = collections.defaultdict(str)
  box_to_instance_masks_map = {}
  box_to_instance_boundaries_map = {}
  box_to_keypoints_map = collections.defaultdict(list)
  box_to_keypoint_scores_map = collections.defaultdict(list)
  box_to_track_ids_map = {}
  if not max_boxes_to_draw :
    max_boxes_to_draw = boxes.shape[0]
  for i in range(boxes.shape[0]) :
    if max_boxes_to_draw == len(box_to_color_map) :
      break
    if scores is None or scores[i] > min_score_thresh :
      box = tuple(boxes[i].tolist())
      if instance_masks is not None :
        box_to_instance_masks_map[box] = instance_masks[i]
      if instance_boundaries is not None :
        box_to_instance_boundaries_map[box] = instance_boundaries[i]
      if keypoints is not None :
        box_to_keypoints_map[box].extend(keypoints[i])
      if keypoint_scores is not None :
        box_to_keypoint_scores_map[box].extend(keypoint_scores[i])
      if track_ids is not None :
        box_to_track_ids_map[box] = track_ids[i]
      if scores is None :
        box_to_color_map[box] = groundtruth_box_visualization_color
      else :
        display_str = ''
        if not skip_labels :
          if not agnostic_mode :
            if classes[i] in six.viewkeys(category_index) :
              class_name = category_index[classes[i]]['name']
            else :
              class_name = 'N/A'
            display_str = str(class_name)
        final_label = display_str
        if not skip_scores :
          if not display_str :
            display_str = '{}%'.format(round(100*scores[i]))
            final_label = display_str
          else :
            display_str = '{} : {}%'.format(display_str, round(100*scores[i]))
        if not skip_track_ids and track_ids is not None :
          if not display_str :
            display_str = 'ID {}'.format(track_ids[i])
            final_label = track_ids[i]
          else :
            display_str = '{}: ID {}'.format(display_str, track_ids[i])


        box_to_display_str_map[box].append(display_str)
        if agnostic_mode :
          box_to_color_map[box] = 'DarkOrange'
        elif track_ids is not None :
          prime_multipler = _get_multiplier_for_color_randomness()
          box_to_color_map[box] = STANDARD_COLORS [
              (prime_multipler * track_ids[i]) % len(STANDARD_COLORS)
          ]
        else :
          box_to_color_map[box] = STANDARD_COLORS [
              classes[i] % len(STANDARD_COLORS)
          ]


  final_percent = 1
  global final_box
  global final_color
  for box, colour in box_to_color_map.items() :
    not_include_list = box_to_display_str_map[box][0].split()
    label = not_include_list[0]
    percent = not_include_list[-1]
    percent = int(percent[0:2])

    if percent > final_percent :
      final_percent = percent
      final_label = label
      final_box = box
      final_color = colour

  final_list = []
  final_comp = final_label + ' : ' + str(final_percent) +'%'
  final_list.append(final_comp)


  for box, color in box_to_color_map.items() :
    ymin, xmin, ymax, xmax = final_box
    if instance_masks is not None :
      draw_mask_on_image_array (
          image,
          box_to_instance_masks_map[box],
          color='red',
          alpha=1.0
      ) 
    if instance_boundaries is not None :
      draw_mask_on_image_array (
          image,
          box_to_instance_boundaries_map[box],
          color='red',
          alpha=1.0
      )

    draw_bounding_box_on_image_array (
        image, 
        ymin,
        xmin,
        ymax,
        xmax,
        color = final_color,
        thickness=0 if skip_boxes else line_thickness,
        display_str_list = final_list,
        use_normalized_coordinates = use_normalized_coordinates
      )

    if keypoints is not None :
      keypoint_scores_for_box = None
      if box_to_keypoint_scores_map :
        keypoint_scores_for_box = box_to_keypoint_scores_map[box]
      draw_keypoints_on_image_array (
          image,
          box_to_keypoints_map[box],
          keypoint_scores_for_box,
          min_score_thresh = min_score_thresh,
          color=color,
          radius=line_thickness/2,
          use_normalized_coordinates = use_normalized_coordinates,
          keypoint_edges = keypoint_edges,
          keypoint_edge_color = color,
          keypoint_edge_width = line_thickness//2
      )
  return final_label


def run_inference(model, image) :
  imagee = np.asarray(image)

  input_tensor = tf.convert_to_tensor(imagee)
  input_tensor = input_tensor[tf.newaxis,...]

  model_fn = model.signatures['serving_default']

  output_dict = model_fn(input_tensor)

  num_detections = int(output_dict.pop('num_detections'))

  output_dict = {key:value[0, :num_detections].numpy()
                for key, value in output_dict.items()}
  output_dict['num_detections'] = num_detections
  output_dict['detection_classes'] = output_dict['detection_classes'].astype(np.int64)

  if 'detection_masks' in output_dict :
    detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
        output_dict['detection_masks'], output_dict['detection_boxes'],
        image.shape[0], image.shape[1]
    )
    detection_masks_reframed = tf.cast(detection_masks_reframed > 0.5,
                                       tf.uint8)
    output_dict['detection_masks_reframed'] = detection_masks_reframed.numpy()
    
  return output_dict


def show_inference(detection_model, image_open) :

    PATH_TO_LABELS = 'object_detection/training/label_map.pbtxt'
    category_index = label_map_util.create_category_index_from_labelmap(
                      PATH_TO_LABELS, use_display_name = True)
    # utils_ops.tf = tf.compat.v1
    # tf.gfile = tf.io.gfile

    # detection_model = tf.saved_model.load('object_detection/inference_graph/saved_model')                  

    image_np = np.array(image_open)

    output_dict = run_inference(detection_model, image_np)

    dtct_result = visualize_boxes_and_labels_on_image_array (
        image_np,
        output_dict['detection_boxes'],
        output_dict['detection_classes'],
        output_dict['detection_scores'],
        category_index,
        instance_masks = output_dict.get('detection_masks_reframed', None),
        use_normalized_coordinates = True,
        line_thickness = 8
    )

    display(Image.fromarray(image_np))
    
    return dtct_result
