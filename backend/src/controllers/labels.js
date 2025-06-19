import { v4 as uuidv4 } from 'uuid';

//in-memory list to store label objects
const labels = [];

export const getLabels = (req, res) => {
  res.status(200).json(labels.filter(l => l.owner === req.userId));
};

export const createLabel = (req, res) => {
  const { name } = req.body;

  //return error if no name was provided
  if (!name){
    return res.status(400).json({ error: 'Name is required' });
  }

  //creatimg and store the new label
  const label = { id: uuidv4(), name, owner: req.userId };
  labels.push(label);

  //responding with 201 created and the new label's location
  res.status(201).location(`/api/labels/${label.id}`).end();
};

export const getLabelById = (req, res) => {
  //finding the label by id
  const label = labels.find(l => l.id === req.params.id);
  //if the id not found return 404
  if (!label){
    return res.status(404).json({ error: 'Label not found' });
  }
  //return the label
  res.json(label);
};

export const updateLabel = (req, res) => {
  //finding the label by id
  const label = labels.find(l => l.id === req.params.id);

  //if the label is not exist return 404 not found
  if (!label || label.owner !== req.userId){
    return res.status(404).json({ error: 'Label not found' });
  }

  //updatimg the label name, if the name is missing keeps the old name
  label.name = req.body.name || label.name;

  //respondign 204 No Content, success with no response body
  res.status(204).end();
};

export const deleteLabel = (req, res) => {
  //finding the label index by id
  const index = labels.findIndex(l => l.id === req.params.id);

  //if the label is not exist, returns 404 not found
  if (index === -1 || labels[index].owner !== req.userId) {
    return res.status(404).json({ error: 'Label not found' });
  }

  //removimg label from the array
  labels.splice(index, 1);
  res.status(204).end();
};
