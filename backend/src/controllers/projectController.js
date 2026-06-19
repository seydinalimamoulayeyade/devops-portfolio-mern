const mongoose = require('mongoose');
const Project = require('../models/Project');
const { projectsCreated } = require('../middleware/metrics');

function normalizeTechnologies(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  const rawValue = String(value).trim();
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch (error) {
    // A simple comma-separated value is also accepted from multipart forms.
  }

  return rawValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanProjectPayload(body) {
  return {
    libelle: body.libelle,
    description: body.description,
    details: body.details,
    technologies: normalizeTechnologies(body.technologies),
    lienGithub: body.lienGithub || '',
    lienDemo: body.lienDemo || '',
    categorie: body.categorie || '',
    statut: body.statut || 'En cours',
  };
}

exports.getProjects = async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Identifiant de projet invalide' });
  }

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ message: 'Projet non trouve' });
  }

  res.json(project);
};

exports.createProject = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const payload = cleanProjectPayload(req.body);

    const project = new Project({
      ...payload,
      image: imagePath,
    });

    const saved = await project.save();
    projectsCreated.inc();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la creation du projet' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Identifiant de projet invalide' });
  }

  try {
    const updateData = cleanProjectPayload(req.body);

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouve' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise a jour' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Identifiant de projet invalide' });
  }

  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    return res.status(404).json({ message: 'Projet non trouve' });
  }

  res.json({ message: 'Projet supprime' });
};
