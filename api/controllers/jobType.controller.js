import { models } from '../models/Sequelize-mysql.js';

export const createJobType = async (req, res, next) => {
  try {
    const { job_type } = req.body;
    if (!job_type || typeof job_type !== 'string' || job_type.trim() === '') {
      const error = new Error("Job type name (job_type) is required and must be a non-empty string.");
      error.status = 400;
      return next(error);
    }
    const trimmedName = job_type.trim();
    const newJobType = await models.JobType.create({ job_type: trimmedName });
    console.log(`JobType created: id=${newJobType.id}`);
    res.status(201).json({ success: true, message: 'Job type created successfully', jobType: newJobType });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const err = new Error(`Job type name '${req.body.job_type}' already exists.`);
      err.status = 409;
      return next(err);
    }
    console.error('Error creating job type:', error.message);
    next(error);
  }
};

export const getAllJobTypes = async (req, res, next) => {
  try {
    const jobTypes = await models.JobType.findAll({
      attributes: ['id', 'job_type']
    });
    res.status(200).json({ success: true, jobTypes });
  } catch (error) {
    console.error('Error fetching job types:', error.message);
    next(error);
  }
};

export const getJobTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobType = await models.JobType.findByPk(id, {
      attributes: ['id', 'job_type']
    });
    if (!jobType) {
      const error = new Error('Job type not found');
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ success: true, jobType });
  } catch (error) {
    console.error('Error fetching job type by ID:', error.message);
    next(error);
  }
};

export const updateJobType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { job_type } = req.body;
    if (!job_type || typeof job_type !== 'string' || job_type.trim() === '') {
      const error = new Error("Job type name (job_type) is required and must be a non-empty string.");
      error.status = 400;
      return next(error);
    }
    const trimmedName = job_type.trim();
    const jobTypeInstance = await models.JobType.findByPk(id);
    if (!jobTypeInstance) {
      const error = new Error('Job type not found');
      error.status = 404;
      return next(error);
    }
    jobTypeInstance.job_type = trimmedName;
    await jobTypeInstance.save();
    console.log(`JobType updated: id=${id}`);
    res.status(200).json({ success: true, message: 'Job type updated successfully', jobType: jobTypeInstance });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const err = new Error(`Job type name '${req.body.job_type}' already exists.`);
      err.status = 409;
      return next(err);
    }
    console.error('Error updating job type:', error.message);
    next(error);
  }
};

export const deleteJobType = async (req, res, next) => {
  const jobTypeId = req.params.id;
  try {
    const jobTypeInstance = await models.JobType.findByPk(jobTypeId);
    if (!jobTypeInstance) {
      const error = new Error('Job type not found');
      error.status = 404;
      return next(error);
    }

    //KIỂM TRA RÀNG BUỘC
    const gigCount = await models.Gig.count({ where: { job_type_id: jobTypeId } });
    const searchHistoryCount = await models.UserSearchHistory.count({ where: { job_type_id: jobTypeId } });

    if (gigCount > 0 || searchHistoryCount > 0) {
      console.warn(`Deletion prevented for job type ID ${jobTypeId}: Used in ${gigCount} gigs and ${searchHistoryCount} search histories.`);
      const error = new Error(`Cannot delete job type because it is currently used by ${gigCount} gig(s) and ${searchHistoryCount} search history record(s).`);
      error.status = 409; 
      return next(error);
    }

    await jobTypeInstance.destroy();
    console.log(`JobType deleted: id=${jobTypeId}`);
    res.status(204).send();
  } catch (error) {
     if (error.name === 'SequelizeForeignKeyConstraintError') {
        console.warn(`Deletion failed for job type ID ${jobTypeId} due to DB foreign key constraint.`);
        const err = new Error("Cannot delete job type due to database constraints (referenced by other records).");
        err.status = 409;
       return next(err);
     }
    console.error('Error deleting job type:', error.message);
    next(error);
  }
};
